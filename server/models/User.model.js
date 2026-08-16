import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    // Student-specific fields
    college: { type: String, default: "" },
    branch: { type: String, default: "" },
    graduationYear: { type: Number },
    phone: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    skills: [{ type: String }],
    resumeUrl: { type: String, default: "" },
    atsScore: { type: Number, default: 0 },
    placementReadinessScore: { type: Number, default: 0 },
    certificates: [
      {
        title: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    resetOtpHash: { type: String, select: false },
    resetOtpExpire: { type: Date, select: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
