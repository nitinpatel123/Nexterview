import asyncHandler from "express-async-handler";
import crypto from "crypto";
import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";
import { isValidEmail, isStrongPassword } from "../utils/validators.js";
import { sendResetOtpEmail } from "../services/email.service.js";

// @desc    Register new student/admin
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid email");
  }

  if (!isStrongPassword(password)) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  // Note: role should typically default to 'student'.
  // Admin accounts should be created manually/seeded, not via public signup.
  const user = await User.create({
    name,
    email,
    password,
    role: role === "admin" ? "student" : role || "student",
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get logged-in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @desc    Request a password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide your email");
  }

  const user = await User.findOne({ email });

  // Always respond with the same generic message, whether or not the user
  // exists — this avoids leaking which emails are registered.
  const genericMessage = "If an account exists for that email, a 6-digit code has been sent.";

  if (!user) {
    return res.json({ success: true, message: genericMessage });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetOtpHash = otpHash;
  user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  await sendResetOtpEmail(user.email, otp);

  res.json({ success: true, message: genericMessage });
});

// @desc    Verify OTP and reset password in one step
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    res.status(400);
    throw new Error("Please provide email, OTP, and new password");
  }

  if (!isStrongPassword(password)) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    resetOtpHash: otpHash,
    resetOtpExpire: { $gt: Date.now() },
  }).select("+resetOtpHash +resetOtpExpire");

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired code. Please request a new one.");
  }

  user.password = password;
  user.resetOtpHash = undefined;
  user.resetOtpExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Password reset successful.",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});
