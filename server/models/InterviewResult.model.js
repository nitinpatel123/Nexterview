import mongoose from "mongoose";

const interviewResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true },
    type: { type: String, default: "technical" },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    score: { type: Number, required: true }, // 0-10
    feedback: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("InterviewResult", interviewResultSchema);
