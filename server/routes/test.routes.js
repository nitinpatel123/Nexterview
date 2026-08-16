import express from "express";
import {
  getTests,
  getTestById,
  createTest,
  submitTest,
  getMyResults,
} from "../controllers/test.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTests).post(authorize("admin"), createTest);
router.get("/results/me", authorize("student"), getMyResults);
router.get("/:id", getTestById);
router.post("/:id/submit", authorize("student"), submitTest);

export default router;
