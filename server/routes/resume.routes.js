import express from "express";
import {
  saveResume,
  getMyResume,
  downloadResumePDF,
} from "../controllers/resume.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(saveResume).get(getMyResume);
router.get("/download", downloadResumePDF);

export default router;
