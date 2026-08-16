import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
import Resume from "../models/Resume.model.js";
import TestResult from "../models/TestResult.model.js";
import InterviewResult from "../models/InterviewResult.model.js";

// @desc    Get logged-in student's profile
// @route   GET /api/student/profile
// @access  Private (student)
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ success: true, data: user });
});

// @desc    Update logged-in student's profile
// @route   PUT /api/student/profile
// @access  Private (student)
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "college", "branch", "graduationYear", "phone", "skills"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.json({ success: true, data: user });
});

// @desc    Upload a certificate (file already uploaded to Cloudinary via multer middleware)
// @route   POST /api/student/certificates
// @access  Private (student)
export const uploadCertificate = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a certificate file");
  }

  const user = await User.findById(req.user._id);
  user.certificates.push({
    title: title || req.file.originalname,
    url: req.file.path, // Cloudinary URL
  });
  await user.save();

  res.status(201).json({ success: true, data: user.certificates });
});

// @desc    Delete a certificate
// @route   DELETE /api/student/certificates/:certId
// @access  Private (student)
export const deleteCertificate = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.certificates = user.certificates.filter(
    (c) => c._id.toString() !== req.params.certId
  );
  await user.save();
  res.json({ success: true, data: user.certificates });
});

// @desc    Get full dashboard summary: placement readiness score, skill graph, weekly progress
// @route   GET /api/student/dashboard-summary
// @access  Private (student)
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const resume = await Resume.findOne({ user: req.user._id });

  // ---- Skill Graph: average % score per test category ----
  const skillGraphAgg = await TestResult.aggregate([
    { $match: { student: user._id } },
    {
      $lookup: {
        from: "tests",
        localField: "test",
        foreignField: "_id",
        as: "testInfo",
      },
    },
    { $unwind: "$testInfo" },
    {
      $group: {
        _id: "$testInfo.category",
        avgPercentage: { $avg: "$percentage" },
        attempts: { $sum: 1 },
      },
    },
  ]);

  const skillGraph = skillGraphAgg.map((s) => ({
    category: s._id,
    score: Math.round(s.avgPercentage * 100) / 100,
    attempts: s.attempts,
  }));

  // ---- Weekly Progress: avg test % for last 6 weeks ----
  const sixWeeksAgo = new Date();
  sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

  const weeklyAgg = await TestResult.aggregate([
    { $match: { student: user._id, createdAt: { $gte: sixWeeksAgo } } },
    {
      $group: {
        _id: { $week: "$createdAt" },
        avgPercentage: { $avg: "$percentage" },
        weekStart: { $min: "$createdAt" },
      },
    },
    { $sort: { weekStart: 1 } },
  ]);

  const weeklyProgress = weeklyAgg.map((w) => ({
    week: w.weekStart.toISOString().slice(0, 10),
    score: Math.round(w.avgPercentage * 100) / 100,
  }));

  // ---- Interview Score: average of last 10 mock interview answer scores (0-10 -> %) ----
  const recentInterviews = await InterviewResult.find({ student: user._id })
    .sort({ createdAt: -1 })
    .limit(10);
  const interviewScore =
    recentInterviews.length > 0
      ? Math.round(
          (recentInterviews.reduce((sum, r) => sum + r.score, 0) / recentInterviews.length / 10) * 100
        )
      : 0;

  // ---- Coding Progress: from the skill graph's Coding category, if attempted ----
  const codingEntry = skillGraph.find((s) => s.category === "Coding");
  const codingProgress = codingEntry ? Math.round(codingEntry.score) : 0;

  // ---- Profile Completion: how filled-out the student's profile is ----
  const profileFields = [
    !!user.college,
    !!user.branch,
    !!user.graduationYear,
    !!user.phone,
    (user.skills?.length || 0) > 0,
    !!resume,
    (user.certificates?.length || 0) > 0,
  ];
  const profileCompletion = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100
  );

  // ---- Placement Readiness Score (weighted formula) ----
  // 40% ATS score, 35% avg test performance, 15% certificates, 10% resume completeness
  const avgTestScore =
    skillGraph.length > 0
      ? skillGraph.reduce((sum, s) => sum + s.score, 0) / skillGraph.length
      : 0;

  const certificateScore = Math.min((user.certificates?.length || 0) * 20, 100); // cap at 5 certs = 100%

  const resumeCompleteness = resume
    ? [
        resume.fullName,
        resume.summary,
        resume.skills?.length > 0,
        resume.education?.length > 0,
        resume.projects?.length > 0,
      ].filter(Boolean).length * 20
    : 0;

  const placementReadinessScore = Math.round(
    (user.atsScore || 0) * 0.4 +
      avgTestScore * 0.35 +
      certificateScore * 0.15 +
      resumeCompleteness * 0.1
  );

  // Persist so it's available elsewhere (e.g. admin views)
  user.placementReadinessScore = placementReadinessScore;
  await user.save();

  res.json({
    success: true,
    data: {
      atsScore: user.atsScore || 0,
      placementReadinessScore,
      interviewScore,
      codingProgress,
      profileCompletion,
      skillGraph,
      weeklyProgress,
      certificatesCount: user.certificates?.length || 0,
      testsAttempted: skillGraph.reduce((sum, s) => sum + s.attempts, 0),
    },
  });
});
