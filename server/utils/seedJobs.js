import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// Seeds a handful of realistic job postings so Job Recommendations,
// Job Postings, and the apply flow all have real data to demo with.
//
// Usage:
//   node utils/seedJobs.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import Job from "../models/Job.model.js";
import User from "../models/User.model.js";

dotenv.config();

const jobs = [
  {
    title: "Frontend Developer (Fresher)",
    company: "TechNova Solutions",
    description:
      "Build and maintain responsive web interfaces using React and Tailwind CSS. Work closely with designers and backend engineers to ship features fast.",
    requiredSkills: ["React", "JavaScript", "Tailwind CSS", "HTML", "CSS"],
    location: "Bangalore",
    jobType: "Full-time",
  },
  {
    title: "Full Stack Developer Intern",
    company: "BrightPath Labs",
    description:
      "Work across the stack — React frontend, Node.js/Express backend, MongoDB database. Great opportunity to ship real features in a small team.",
    requiredSkills: ["React", "Node.js", "Express.js", "MongoDB", "JavaScript"],
    location: "Remote",
    jobType: "Internship",
  },
  {
    title: "Backend Developer",
    company: "CloudBridge Systems",
    description:
      "Design and build REST APIs, work with MongoDB and JWT-based authentication, and help scale our backend services.",
    requiredSkills: ["Node.js", "Express.js", "MongoDB", "REST APIs", "JWT Authentication"],
    location: "Pune",
    jobType: "Full-time",
  },
  {
    title: "Python Developer (Fresher)",
    company: "DataForge Analytics",
    description:
      "Build data pipelines and backend services in Python. Exposure to APIs, automation scripts, and basic ML workflows.",
    requiredSkills: ["Python", "REST APIs", "Git"],
    location: "Hyderabad",
    jobType: "Full-time",
  },
  {
    title: "Software Engineer Trainee",
    company: "Orion Digital",
    description:
      "1-year trainee program covering full-stack development, code reviews, and agile practices. Great for freshers building a strong foundation.",
    requiredSkills: ["JavaScript", "React", "Git", "MongoDB"],
    location: "Noida",
    jobType: "Full-time",
  },
  {
    title: "MERN Stack Developer Intern",
    company: "PixelCraft Studio",
    description:
      "Contribute to client projects built on the MERN stack. Ship real UI components and small backend features under mentor guidance.",
    requiredSkills: ["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS"],
    location: "Remote",
    jobType: "Internship",
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.log("⚠️  No admin account found. Run `npm run seed:admin` first.");
    process.exit(1);
  }

  let created = 0;
  for (const j of jobs) {
    const exists = await Job.findOne({ title: j.title, company: j.company });
    if (exists) {
      console.log(`⏭️  Skipping "${j.title}" at ${j.company} — already exists.`);
      continue;
    }
    await Job.create({ ...j, postedBy: admin._id });
    console.log(`✅ Created "${j.title}" at ${j.company}`);
    created++;
  }

  console.log(`\n🎉 Done. ${created} new job(s) created.`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
