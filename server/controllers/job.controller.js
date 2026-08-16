import asyncHandler from "express-async-handler";
import Job from "../models/Job.model.js";
import User from "../models/User.model.js";

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Private
export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: jobs.length, data: jobs });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  res.json({ success: true, data: job });
});

// @desc    Create a job posting
// @route   POST /api/jobs
// @access  Private (admin)
export const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json({ success: true, data: job });
});

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (admin)
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.json({ success: true, data: job });
});

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (admin)
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  res.json({ success: true, message: "Job deleted successfully" });
});

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private (student)
export const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const alreadyApplied = job.applicants.some(
    (a) => a.student.toString() === req.user._id.toString()
  );

  if (alreadyApplied) {
    res.status(400);
    throw new Error("You have already applied to this job");
  }

  job.applicants.push({ student: req.user._id });
  await job.save();

  res.json({ success: true, message: "Applied successfully" });
});

// @desc    Get jobs recommended for the logged-in student, ranked by skill match
// @route   GET /api/jobs/recommended
// @access  Private (student)
export const getRecommendedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const studentSkills = (user.skills || []).map((s) => s.toLowerCase().trim());

  const jobs = await Job.find({ isActive: true });

  const scored = jobs.map((job) => {
    const requiredSkills = (job.requiredSkills || []).map((s) => s.toLowerCase().trim());
    const matchedSkills = requiredSkills.filter((s) => studentSkills.includes(s));
    const matchPercentage =
      requiredSkills.length > 0
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 0;

    return {
      job,
      matchPercentage,
      matchedSkills,
    };
  });

  // Highest match first; only show jobs with at least some relevance if the
  // student has skills listed, otherwise show everything unscored.
  scored.sort((a, b) => b.matchPercentage - a.matchPercentage);

  res.json({ success: true, count: scored.length, data: scored });
});
