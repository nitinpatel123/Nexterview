import express from "express";
import {
  getProfile,
  updateProfile,
  uploadCertificate,
  deleteCertificate,
  getDashboardSummary,
} from "../controllers/student.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protect, authorize("student"));

router.route("/profile").get(getProfile).put(updateProfile);
router.get("/dashboard-summary", getDashboardSummary);
router.post("/certificates", upload.single("certificate"), uploadCertificate);
router.delete("/certificates/:certId", deleteCertificate);

export default router;
