import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
import Job from "../models/Job.model.js";
import Test from "../models/Test.model.js";
import TestResult from "../models/TestResult.model.js";

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (admin)
export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: "student" }).select("-password");
  res.json({ success: true, count: students.length, data: students });
});

// @desc    Get single student detail
// @route   GET /api/admin/students/:id
// @access  Private (admin)
export const getStudentById = asyncHandler(async (req, res) => {
  const student = await User.findOne({ _id: req.params.id, role: "student" }).select(
    "-password"
  );

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const testResults = await TestResult.find({ student: student._id }).populate(
    "test",
    "title category"
  );

  res.json({ success: true, data: { student, testResults } });
});

// @desc    Delete a student
// @route   DELETE /api/admin/students/:id
// @access  Private (admin)
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await User.findOneAndDelete({ _id: req.params.id, role: "student" });
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  res.json({ success: true, message: "Student removed successfully" });
});

// @desc    Get placement analytics overview
// @route   GET /api/admin/analytics
// @access  Private (admin)
export const getAnalytics = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalJobs = await Job.countDocuments();
  const activeJobs = await Job.countDocuments({ isActive: true });

  const jobs = await Job.find();
  const totalApplications = jobs.reduce((sum, j) => sum + j.applicants.length, 0);
  const totalSelected = jobs.reduce(
    (sum, j) => sum + j.applicants.filter((a) => a.status === "Selected").length,
    0
  );

  const avgATSScoreAgg = await User.aggregate([
    { $match: { role: "student" } },
    { $group: { _id: null, avgATS: { $avg: "$atsScore" } } },
  ]);

  res.json({
    success: true,
    data: {
      totalStudents,
      totalJobs,
      activeJobs,
      totalApplications,
      totalSelected,
      placementRate:
        totalApplications > 0
          ? Math.round((totalSelected / totalApplications) * 10000) / 100
          : 0,
      avgATSScore: Math.round((avgATSScoreAgg[0]?.avgATS || 0) * 100) / 100,
    },
  });
});

// @desc    Get result analysis across all tests (per-test averages + top/bottom performers)
// @route   GET /api/admin/result-analysis
// @access  Private (admin)
export const getResultAnalysis = asyncHandler(async (req, res) => {
  const tests = await Test.find().select("title category totalMarks");

  const perTestStats = await TestResult.aggregate([
    {
      $group: {
        _id: "$test",
        avgPercentage: { $avg: "$percentage" },
        attempts: { $sum: 1 },
        highest: { $max: "$percentage" },
        lowest: { $min: "$percentage" },
      },
    },
  ]);

  const statsMap = {};
  perTestStats.forEach((s) => {
    statsMap[s._id.toString()] = s;
  });

  const testAnalysis = tests.map((t) => ({
    testId: t._id,
    title: t.title,
    category: t.category,
    attempts: statsMap[t._id.toString()]?.attempts || 0,
    avgPercentage: Math.round((statsMap[t._id.toString()]?.avgPercentage || 0) * 100) / 100,
    highest: Math.round((statsMap[t._id.toString()]?.highest || 0) * 100) / 100,
    lowest: Math.round((statsMap[t._id.toString()]?.lowest || 0) * 100) / 100,
  }));

  const topPerformers = await TestResult.find()
    .sort({ percentage: -1 })
    .limit(5)
    .populate("student", "name email")
    .populate("test", "title");

  res.json({
    success: true,
    data: { testAnalysis, topPerformers },
  });
});
