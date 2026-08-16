import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        submittedAnswer: String,
        isCorrect: Boolean,
      },
    ],
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    timeTaken: Number, // in seconds
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("TestResult", testResultSchema);
