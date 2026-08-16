import express from "express";
import {
  getAllStudents,
  getStudentById,
  deleteStudent,
  getAnalytics,
  getResultAnalysis,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.delete("/students/:id", deleteStudent);
router.get("/analytics", getAnalytics);
router.get("/result-analysis", getResultAnalysis);

export default router;
