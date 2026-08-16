import asyncHandler from "express-async-handler";
import Resume from "../models/Resume.model.js";
import User from "../models/User.model.js";
import Job from "../models/Job.model.js";
import InterviewResult from "../models/InterviewResult.model.js";
import * as aiProvider from "../services/groq.service.js";
import pdfParse from "pdf-parse";

// @desc    Analyze resume and return ATS score + suggestions
// @route   POST /api/ai/resume-analysis
// @access  Private (student)
export const resumeAnalysis = asyncHandler(async (req, res) => {
  const { targetRole } = req.body;

  const resume = await Resume.findOne({ user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Please create your resume first");
  }

  const resumeText = `
Name: ${resume.fullName}
Summary: ${resume.summary}
Skills: ${resume.skills?.join(", ")}
Experience: ${resume.experience?.map((e) => `${e.role} at ${e.company}: ${e.description}`).join("; ")}
Projects: ${resume.projects?.map((p) => `${p.title}: ${p.description}`).join("; ")}
Education: ${resume.education?.map((e) => `${e.degree} - ${e.institution}`).join("; ")}
`;

  const analysis = await aiProvider.analyzeResumeATS(resumeText, targetRole);

  // Save results back to resume + user
  resume.atsScore = analysis.atsScore;
  resume.aiSuggestions = analysis.suggestions;
  await resume.save();

  await User.findByIdAndUpdate(req.user._id, { atsScore: analysis.atsScore });

  res.json({ success: true, data: analysis });
});

// @desc    Analyze skill gap vs target role
// @route   POST /api/ai/skill-gap
// @access  Private (student)
export const skillGapAnalysis = asyncHandler(async (req, res) => {
  const { targetRole } = req.body;

  if (!targetRole) {
    res.status(400);
    throw new Error("Please provide a target role");
  }

  const user = await User.findById(req.user._id);
  const result = await aiProvider.analyzeSkillGap(user.skills || [], targetRole);

  res.json({ success: true, data: result });
});

// @desc    Generate career roadmap
// @route   POST /api/ai/career-roadmap
// @access  Private (student)
export const careerRoadmap = asyncHandler(async (req, res) => {
  const { targetRole, experienceLevel } = req.body;

  if (!targetRole) {
    res.status(400);
    throw new Error("Please provide a target role");
  }

  const user = await User.findById(req.user._id);
  const result = await aiProvider.generateCareerRoadmap(
    user.skills || [],
    targetRole,
    experienceLevel
  );

  res.json({ success: true, data: result });
});

// @desc    Generate mock interview questions
// @route   POST /api/ai/interview-questions
// @access  Private (student)
export const interviewQuestions = asyncHandler(async (req, res) => {
  const { role, type, count } = req.body;

  if (!role) {
    res.status(400);
    throw new Error("Please provide a target role");
  }

  const result = await aiProvider.generateInterviewQuestions(role, type, count);
  res.json({ success: true, data: result });
});

// @desc    Evaluate a mock interview answer
// @route   POST /api/ai/evaluate-answer
// @access  Private (student)
export const evaluateAnswer = asyncHandler(async (req, res) => {
  const { question, answer, role, type } = req.body;

  if (!question || !answer) {
    res.status(400);
    throw new Error("Please provide both question and answer");
  }

  const result = await aiProvider.evaluateInterviewAnswer(question, answer);

  // Save so it counts toward the student's Interview Score on the dashboard
  await InterviewResult.create({
    student: req.user._id,
    role: role || "Software Engineer",
    type: type || "technical",
    question,
    answer,
    score: result.score,
    feedback: result.feedback,
  });

  res.json({ success: true, data: result });
});

// @desc    Generate a cover letter for a job
// @route   POST /api/ai/cover-letter
// @access  Private (student)
export const coverLetter = asyncHandler(async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription) {
    res.status(400);
    throw new Error("Please provide a job description");
  }

  const user = await User.findById(req.user._id);
  const result = await aiProvider.generateCoverLetter(
    { name: user.name, skills: user.skills, college: user.college },
    jobDescription
  );

  res.json({ success: true, data: result });
});

// @desc    Suggest LinkedIn profile improvements
// @route   POST /api/ai/linkedin-suggestions
// @access  Private (student)
export const linkedinSuggestions = asyncHandler(async (req, res) => {
  const { headline, about } = req.body;

  const user = await User.findById(req.user._id);
  const result = await aiProvider.suggestLinkedInImprovements(
    headline || "",
    about || "",
    user.skills || []
  );

  res.json({ success: true, data: result });
});

// @desc    Upload a resume PDF and get standalone ATS analysis (no saved resume needed)
// @route   POST /api/ai/ats-checker
// @access  Private (student)
export const atsChecker = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a PDF resume");
  }

  const { targetRole } = req.body;

  let resumeText;
  try {
    const parsed = await pdfParse(req.file.buffer);
    resumeText = parsed.text?.trim();
  } catch {
    res.status(400);
    throw new Error("Could not read that PDF. Please make sure it's a valid, text-based PDF.");
  }

  if (!resumeText || resumeText.length < 50) {
    res.status(400);
    throw new Error("Couldn't extract enough text from this PDF — it may be a scanned image rather than text.");
  }

  const analysis = await aiProvider.analyzeResumeATS(resumeText, targetRole || "Software Engineer");
  res.json({ success: true, data: analysis });
});

// @desc    Compare a resume against a job description
// @route   POST /api/ai/resume-jd-match
// @access  Private (student)
export const resumeJdMatch = asyncHandler(async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription) {
    res.status(400);
    throw new Error("Please provide a job description");
  }

  const resume = await Resume.findOne({ user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Please create your resume first (Resume Builder)");
  }

  const resumeText = `
Summary: ${resume.summary}
Skills: ${resume.skills?.join(", ")}
Experience: ${resume.experience?.map((e) => `${e.role} at ${e.company}: ${e.description}`).join("; ")}
Projects: ${resume.projects?.map((p) => `${p.title}: ${p.description}`).join("; ")}
Education: ${resume.education?.map((e) => `${e.degree} - ${e.institution}`).join("; ")}
`;

  const result = await aiProvider.matchResumeToJD(resumeText, jobDescription);
  res.json({ success: true, data: result });
});

// @desc    Career guidance chatbot
// @route   POST /api/ai/career-chat
// @access  Private (student)
export const careerChat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Please provide a message");
  }

  const reply = await aiProvider.careerChatReply(message, history || []);
  res.json({ success: true, data: { reply } });
});
