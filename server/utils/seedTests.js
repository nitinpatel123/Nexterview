import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// One-time script to seed realistic demo tests (Aptitude, Coding, Reasoning)
// so the Tests page has real content to practice with instead of 1 question.
//
// Usage:
//   node utils/seedTests.js
//
// Safe to re-run — it skips tests that already exist (matched by title).

import dotenv from "dotenv";
import mongoose from "mongoose";
import Test from "../models/Test.model.js";
import User from "../models/User.model.js";

dotenv.config();

const aptitudeQuestions = [
  { questionText: "What is 15% of 200?", options: ["20", "30", "40", "50"], correctAnswer: "30", marks: 1 },
  { questionText: "If a train travels 60 km in 1.5 hours, what is its speed?", options: ["30 km/h", "40 km/h", "45 km/h", "50 km/h"], correctAnswer: "40 km/h", marks: 1 },
  { questionText: "What is the next number in the series: 2, 6, 12, 20, 30, ?", options: ["36", "40", "42", "38"], correctAnswer: "42", marks: 1 },
  { questionText: "A shopkeeper sells an item for ₹450 at a 10% profit. What was the cost price?", options: ["₹400", "₹405", "₹410", "₹409"], correctAnswer: "₹409", marks: 1 },
  { questionText: "If the ratio of boys to girls in a class is 3:2 and there are 30 students, how many boys are there?", options: ["12", "15", "18", "20"], correctAnswer: "18", marks: 1 },
  { questionText: "What is the compound interest on ₹1000 at 10% per annum for 2 years?", options: ["₹200", "₹210", "₹220", "₹100"], correctAnswer: "₹210", marks: 1 },
  { questionText: "A can complete a work in 10 days, B in 15 days. How many days will they take together?", options: ["5 days", "6 days", "8 days", "12 days"], correctAnswer: "6 days", marks: 1 },
  { questionText: "What is the LCM of 12 and 18?", options: ["24", "36", "48", "72"], correctAnswer: "36", marks: 1 },
  { questionText: "If 5 workers can build a wall in 12 days, how many days will 10 workers take?", options: ["4 days", "5 days", "6 days", "8 days"], correctAnswer: "6 days", marks: 1 },
  { questionText: "What is the probability of getting a head when a fair coin is tossed?", options: ["0.25", "0.5", "0.75", "1"], correctAnswer: "0.5", marks: 1 },
];

const reasoningQuestions = [
  { questionText: "Find the odd one out: Dog, Cat, Lion, Snake, Tiger", options: ["Dog", "Snake", "Lion", "Tiger"], correctAnswer: "Snake", marks: 1 },
  { questionText: "If CODING is written as DPEJOH, how is FLOWER written?", options: ["GMPXFS", "GMXPFS", "GMPXSF", "GNPXFS"], correctAnswer: "GMPXFS", marks: 1 },
  { questionText: "Pointing to a photo, Ravi said 'She is the daughter of my grandfather's only son.' Who is she to Ravi?", options: ["Sister", "Cousin", "Aunt", "Mother"], correctAnswer: "Sister", marks: 1 },
  { questionText: "Complete the analogy: Book is to Reading as Fork is to ?", options: ["Drawing", "Writing", "Eating", "Cutting"], correctAnswer: "Eating", marks: 1 },
  { questionText: "If today is Monday, what day will it be after 65 days?", options: ["Monday", "Tuesday", "Wednesday", "Thursday"], correctAnswer: "Tuesday", marks: 1 },
  { questionText: "Which number should replace the question mark: 3, 9, 27, 81, ?", options: ["162", "243", "324", "729"], correctAnswer: "243", marks: 1 },
];

const codingQuestions = [
  {
    questionText: "Write a function that returns the factorial of a given number n.",
    type: "coding",
    sampleInput: "5",
    sampleOutput: "120",
    correctAnswer: "120",
    marks: 5,
  },
  {
    questionText: "Write a function to check if a given string is a palindrome. Return 'true' or 'false'.",
    type: "coding",
    sampleInput: "madam",
    sampleOutput: "true",
    correctAnswer: "true",
    marks: 5,
  },
  {
    questionText: "Write a function that returns the sum of all elements in an array [1,2,3,4,5].",
    type: "coding",
    sampleInput: "[1,2,3,4,5]",
    sampleOutput: "15",
    correctAnswer: "15",
    marks: 5,
  },
  {
    questionText: "Write a function to find the largest number in the array [3, 7, 2, 9, 4].",
    type: "coding",
    sampleInput: "[3,7,2,9,4]",
    sampleOutput: "9",
    correctAnswer: "9",
    marks: 5,
  },
  {
    questionText: "Write a function that reverses the string 'hello'.",
    type: "coding",
    sampleInput: "hello",
    sampleOutput: "olleh",
    correctAnswer: "olleh",
    marks: 5,
  },
];

const testsToCreate = [
  { title: "Quantitative Aptitude Practice", category: "Aptitude", duration: 20, questions: aptitudeQuestions },
  { title: "Logical Reasoning Practice", category: "Reasoning", duration: 15, questions: reasoningQuestions },
  { title: "Coding Fundamentals Practice", category: "Coding", duration: 30, questions: codingQuestions },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.log("⚠️  No admin account found. Run `npm run seed:admin` first.");
    process.exit(1);
  }

  for (const t of testsToCreate) {
    const exists = await Test.findOne({ title: t.title });
    if (exists) {
      console.log(`⏭️  Skipping "${t.title}" — already exists.`);
      continue;
    }

    const totalMarks = t.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    await Test.create({
      title: t.title,
      category: t.category,
      duration: t.duration,
      totalMarks,
      questions: t.questions.map((q) => ({ type: "mcq", ...q })),
      createdBy: admin._id,
    });
    console.log(`✅ Created "${t.title}" with ${t.questions.length} questions`);
  }

  console.log("\n🎉 Done seeding tests.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
