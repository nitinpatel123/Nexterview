import express from "express";
import rateLimit from "express-rate-limit";
import { runCode } from "../controllers/code.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Code execution calls an external judge — rate limit to prevent abuse
const codeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many code execution requests, please try again later" },
});

router.use(protect, codeLimiter);
router.post("/run", runCode);

export default router;
