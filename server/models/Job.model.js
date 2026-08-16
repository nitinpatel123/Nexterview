import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [String],
    location: String,
    salaryRange: String,
    jobType: {
      type: String,
      enum: ["Full-time", "Internship", "Part-time"],
      default: "Full-time",
    },
    eligibility: {
      minCGPA: Number,
      branches: [String],
      graduationYear: [Number],
    },
    applicationDeadline: Date,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    applicants: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["Applied", "Shortlisted", "Rejected", "Selected"],
          default: "Applied",
        },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
