import express from "express";
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getCompanies).post(authorize("admin"), createCompany);
router
  .route("/:id")
  .get(getCompanyById)
  .put(authorize("admin"), updateCompany)
  .delete(authorize("admin"), deleteCompany);

export default router;
