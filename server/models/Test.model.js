import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [String], // for aptitude MCQs
  correctAnswer: String,
  type: {
    type: String,
    enum: ["mcq", "coding"],
    default: "mcq",
  },
  // for coding questions
  sampleInput: String,
  sampleOutput: String,
  marks: { type: Number, default: 1 },
});

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Aptitude", "Coding", "Reasoning", "Technical"],
      required: true,
    },
    duration: { type: Number, required: true }, // in minutes
    totalMarks: { type: Number, default: 0 },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);
