// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");
// const dns = require("dns");
// import dns from "dns";

// // MongoDB Atlas DNS resolution
// dns.setServers([
//   "8.8.8.8",
//   "1.1.1.1"
// ]);

// dns.setDefaultResultOrder("ipv4first");

// require("dotenv").config();
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import jobRoutes from "./routes/job.routes.js";
import testRoutes from "./routes/test.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import companyRoutes from "./routes/company.routes.js";
import studentRoutes from "./routes/student.routes.js";
import codeRoutes from "./routes/code.routes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Nexterview AI API is running 🚀" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/code", codeRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
