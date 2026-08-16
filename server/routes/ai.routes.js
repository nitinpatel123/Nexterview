import express from "express";
import {
  resumeAnalysis,
  skillGapAnalysis,
  careerRoadmap,
  interviewQuestions,
  evaluateAnswer,
  coverLetter,
  linkedinSuggestions,
  atsChecker,
  resumeJdMatch,
  careerChat,
} from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import rateLimit from "express-rate-limit";
import uploadMemory from "../middleware/uploadMemory.middleware.js";

const router = express.Router();

// AI calls are expensive — rate limit to prevent abuse
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each user to 30 AI requests per window
  message: { success: false, message: "Too many AI requests, please try again later" },
});

// Chat is used more frequently in a session — a bit more headroom
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: "Too many chat messages, please slow down" },
});

router.use(protect);

router.post("/resume-analysis", aiLimiter, resumeAnalysis);
router.post("/skill-gap", aiLimiter, skillGapAnalysis);
router.post("/career-roadmap", aiLimiter, careerRoadmap);
router.post("/interview-questions", aiLimiter, interviewQuestions);
router.post("/evaluate-answer", aiLimiter, evaluateAnswer);
router.post("/cover-letter", aiLimiter, coverLetter);
router.post("/linkedin-suggestions", aiLimiter, linkedinSuggestions);
router.post("/ats-checker", aiLimiter, authorize("student"), uploadMemory.single("resume"), atsChecker);
router.post("/resume-jd-match", aiLimiter, authorize("student"), resumeJdMatch);
router.post("/career-chat", chatLimiter, authorize("student"), careerChat);

export default router;
