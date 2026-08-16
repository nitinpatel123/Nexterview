import asyncHandler from "express-async-handler";
import { executeCode, LANGUAGE_IDS } from "../services/judge0.service.js";

// @desc    Run code against given input (for practice/testing, not scoring)
// @route   POST /api/code/run
// @access  Private
export const runCode = asyncHandler(async (req, res) => {
  const { code, language, stdin } = req.body;

  if (!code || !language) {
    res.status(400);
    throw new Error("Please provide code and language");
  }

  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    res.status(400);
    throw new Error(
      `Unsupported language "${language}". Supported: ${Object.keys(LANGUAGE_IDS).join(", ")}`
    );
  }

  const result = await executeCode(code, languageId, stdin || "");
  res.json({ success: true, data: result });
});
