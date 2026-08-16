import asyncHandler from "express-async-handler";
import Resume from "../models/Resume.model.js";
import { generateResumePDF } from "../services/pdf.service.js";

// @desc    Create or update resume
// @route   POST /api/resume
// @access  Private (student)
export const saveResume = asyncHandler(async (req, res) => {
  const existing = await Resume.findOne({ user: req.user._id });

  let resume;
  if (existing) {
    resume = await Resume.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );
  } else {
    resume = await Resume.create({ ...req.body, user: req.user._id });
  }

  res.status(200).json({ success: true, data: resume });
});

// @desc    Get logged-in student's resume
// @route   GET /api/resume
// @access  Private (student)
export const getMyResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id });

  if (!resume) {
    res.status(404);
    throw new Error("No resume found. Please create one first.");
  }

  res.json({ success: true, data: resume });
});

// @desc    Download resume as PDF
// @route   GET /api/resume/download
// @access  Private (student)
export const downloadResumePDF = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id });

  if (!resume) {
    res.status(404);
    throw new Error("No resume found. Please create one first.");
  }

  generateResumePDF(resume, res);
});
