import asyncHandler from "express-async-handler";
import Company from "../models/Company.model.js";
import Job from "../models/Job.model.js";

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort({ name: 1 });
  res.json({ success: true, count: companies.length, data: companies });
});

// @desc    Get single company + its jobs
// @route   GET /api/companies/:id
// @access  Private
export const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }
  const jobs = await Job.find({ company: company.name });
  res.json({ success: true, data: { company, jobs } });
});

// @desc    Create a company
// @route   POST /api/companies
// @access  Private (admin)
export const createCompany = asyncHandler(async (req, res) => {
  const existing = await Company.findOne({ name: req.body.name });
  if (existing) {
    res.status(400);
    throw new Error("Company with this name already exists");
  }

  const company = await Company.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json({ success: true, data: company });
});

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Private (admin)
export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }
  res.json({ success: true, data: company });
});

// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Private (admin)
export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndDelete(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }
  res.json({ success: true, message: "Company deleted successfully" });
});
