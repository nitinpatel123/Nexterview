import asyncHandler from "express-async-handler";
import Test from "../models/Test.model.js";
import TestResult from "../models/TestResult.model.js";
import * as judge0Service from "../services/judge0.service.js";

// @desc    Get all active tests
// @route   GET /api/tests
// @access  Private
export const getTests = asyncHandler(async (req, res) => {
  const tests = await Test.find({ isActive: true }).select("-questions.correctAnswer");
  res.json({ success: true, count: tests.length, data: tests });
});

// @desc    Get single test (to attempt it)
// @route   GET /api/tests/:id
// @access  Private (student)
export const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id).select("-questions.correctAnswer");
  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }
  res.json({ success: true, data: test });
});

// @desc    Create a test
// @route   POST /api/tests
// @access  Private (admin)
export const createTest = asyncHandler(async (req, res) => {
  const totalMarks = req.body.questions?.reduce((sum, q) => sum + (q.marks || 1), 0) || 0;
  const test = await Test.create({
    ...req.body,
    totalMarks,
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, data: test });
});

// @desc    Submit test answers and get scored
// @route   POST /api/tests/:id/submit
// @access  Private (student)
export const submitTest = asyncHandler(async (req, res) => {
  const { answers, timeTaken } = req.body; // answers: [{ questionIndex, submittedAnswer, language? }]

  const test = await Test.findById(req.params.id);
  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  let score = 0;

  const evaluatedAnswers = await Promise.all(
    answers.map(async (ans) => {
      const question = test.questions[ans.questionIndex];
      if (!question) {
        return { questionIndex: ans.questionIndex, submittedAnswer: ans.submittedAnswer, isCorrect: false };
      }

      let isCorrect = false;

      if (question.type === "coding" && ans.language) {
        // Real execution via Judge0 — run the student's code against the
        // question's sample input and compare actual stdout to the
        // expected output stored in correctAnswer.
        try {
          const result = await judge0Service.executeCode(
            ans.submittedAnswer,
            judge0Service.LANGUAGE_IDS[ans.language],
            question.sampleInput || ""
          );
          const actualOutput = (result.stdout || "").trim();
          const expectedOutput = (question.correctAnswer || "").trim();
          isCorrect = actualOutput === expectedOutput;
        } catch {
          // Execution failed (bad code, judge unavailable, etc.) — mark incorrect
          isCorrect = false;
        }
      } else {
        // MCQ / non-executed answers — exact text match
        isCorrect = question.correctAnswer === ans.submittedAnswer;
      }

      if (isCorrect) score += question.marks || 1;

      return {
        questionIndex: ans.questionIndex,
        submittedAnswer: ans.submittedAnswer,
        isCorrect: !!isCorrect,
      };
    })
  );

  const percentage = test.totalMarks > 0 ? (score / test.totalMarks) * 100 : 0;

  const result = await TestResult.create({
    student: req.user._id,
    test: test._id,
    answers: evaluatedAnswers,
    score,
    totalMarks: test.totalMarks,
    percentage: Math.round(percentage * 100) / 100,
    timeTaken,
  });

  res.status(201).json({ success: true, data: result });
});

// @desc    Get logged-in student's test results
// @route   GET /api/tests/results/me
// @access  Private (student)
export const getMyResults = asyncHandler(async (req, res) => {
  const results = await TestResult.find({ student: req.user._id })
    .populate("test", "title category")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: results.length, data: results });
});
