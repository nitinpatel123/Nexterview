import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: String,
    email: String,
    phone: String,
    summary: String,
    education: [
      {
        degree: String,
        institution: String,
        year: String,
        score: String,
      },
    ],
    experience: [
      {
        role: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        techStack: [String],
        link: String,
      },
    ],
    skills: [String],
    certifications: [String],
    // AI analysis results
    atsScore: { type: Number, default: 0 },
    aiSuggestions: [String],
    skillGaps: [String],
    pdfUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
