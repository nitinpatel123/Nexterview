import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// Seeds the 15 most commonly asked placement coding questions.
// Each question is written as a complete stdin -> stdout program problem,
// since Judge0 executes full programs (not isolated functions).
//
// Usage:
//   node utils/seedCodingQuestions.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import Test from "../models/Test.model.js";
import User from "../models/User.model.js";

dotenv.config();

const codingQuestions = [
  {
    questionText:
      "Reverse a String. Read a string from input and print its reverse.",
    sampleInput: "hello",
    sampleOutput: "olleh",
  },
  {
    questionText:
      "Palindrome Check. Read a string and print 'true' if it reads the same backward, else 'false'.",
    sampleInput: "madam",
    sampleOutput: "true",
  },
  {
    questionText: "Factorial. Read an integer n and print n! (factorial of n).",
    sampleInput: "5",
    sampleOutput: "120",
  },
  {
    questionText:
      "Fibonacci Series. Read an integer n and print the first n Fibonacci numbers, space-separated, starting from 0.",
    sampleInput: "6",
    sampleOutput: "0 1 1 2 3 5",
  },
  {
    questionText:
      "Prime Check. Read an integer n and print 'true' if it is prime, else 'false'.",
    sampleInput: "7",
    sampleOutput: "true",
  },
  {
    questionText: "Sum of Digits. Read an integer n and print the sum of its digits.",
    sampleInput: "1234",
    sampleOutput: "10",
  },
  {
    questionText:
      "Largest of Three. Read three space-separated integers and print the largest one.",
    sampleInput: "4 9 2",
    sampleOutput: "9",
  },
  {
    questionText:
      "Count Vowels. Read a string and print the count of vowels in it (case-insensitive: a, e, i, o, u).",
    sampleInput: "Hello World",
    sampleOutput: "3",
  },
  {
    questionText:
      "Armstrong Number. Read an integer n and print 'true' if it is an Armstrong number (sum of each digit raised to the power of the number of digits equals n), else 'false'.",
    sampleInput: "153",
    sampleOutput: "true",
  },
  {
    questionText:
      "GCD of Two Numbers. Read two space-separated integers and print their GCD (greatest common divisor).",
    sampleInput: "12 18",
    sampleOutput: "6",
  },
  {
    questionText:
      "Bubble Sort. Read space-separated integers and print them sorted in ascending order, space-separated.",
    sampleInput: "5 2 8 1 9",
    sampleOutput: "1 2 5 8 9",
  },
  {
    questionText:
      "Missing Number. First line has an integer n. Second line has n-1 space-separated integers from 1 to n with exactly one missing. Print the missing number.",
    sampleInput: "5\n1 2 4 5",
    sampleOutput: "3",
  },
  {
    questionText:
      "Power of Two. Read an integer n and print 'true' if it is a power of 2, else 'false'.",
    sampleInput: "16",
    sampleOutput: "true",
  },
  {
    questionText:
      "Remove Duplicates. Read space-separated integers and print them with duplicates removed, preserving the first-occurrence order, space-separated.",
    sampleInput: "1 2 2 3 4 4 5",
    sampleOutput: "1 2 3 4 5",
  },
  {
    questionText:
      "Second Largest. Read space-separated integers and print the second largest distinct value.",
    sampleInput: "10 5 20 20 8",
    sampleOutput: "10",
  },
];

const testTitle = "Top 15 Placement Coding Questions";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.log("⚠️  No admin account found. Run `npm run seed:admin` first.");
    process.exit(1);
  }

  const exists = await Test.findOne({ title: testTitle });
  if (exists) {
    console.log(`⏭️  "${testTitle}" already exists — skipping. Delete it first with npm run manage:tests if you want to reseed.`);
    process.exit(0);
  }

  const questions = codingQuestions.map((q) => ({
    questionText: q.questionText,
    type: "coding",
    sampleInput: q.sampleInput,
    sampleOutput: q.sampleOutput,
    correctAnswer: q.sampleOutput, // Judge0's actual stdout is compared against this
    marks: 5,
  }));

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  await Test.create({
    title: testTitle,
    category: "Coding",
    duration: 60,
    totalMarks,
    questions,
    createdBy: admin._id,
  });

  console.log(`✅ Created "${testTitle}" with ${questions.length} questions (${totalMarks} marks total)`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
