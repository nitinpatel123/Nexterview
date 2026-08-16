import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getRecommendedJobs,
} from "../controllers/job.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getJobs).post(authorize("admin"), createJob);
router.get("/recommended", authorize("student"), getRecommendedJobs);
router
  .route("/:id")
  .get(getJobById)
  .put(authorize("admin"), updateJob)
  .delete(authorize("admin"), deleteJob);

router.post("/:id/apply", authorize("student"), applyToJob);

export default router;
