import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// Interactive script to list all tests and delete one by number.
//
// Usage:
//   node utils/manageTests.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import readline from "readline";
import Test from "../models/Test.model.js";

dotenv.config();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  const tests = await Test.find().sort({ createdAt: 1 });

  if (tests.length === 0) {
    console.log("No tests found in the database.");
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log("Existing tests:\n");
  tests.forEach((t, i) => {
    console.log(`${i + 1}. "${t.title}" — ${t.category}, ${t.questions.length} question(s)`);
  });

  const choice = await ask(
    "\nEnter the number of the test to DELETE (or press Enter to cancel): "
  );

  if (!choice.trim()) {
    console.log("Cancelled — nothing deleted.");
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }

  const index = parseInt(choice, 10) - 1;
  const target = tests[index];

  if (!target) {
    console.log("❌ Invalid number.");
    rl.close();
    await mongoose.disconnect();
    process.exit(1);
  }

  const confirm = await ask(`Are you sure you want to delete "${target.title}"? (yes/no): `);
  if (confirm.trim().toLowerCase() !== "yes") {
    console.log("Cancelled — nothing deleted.");
  } else {
    await Test.findByIdAndDelete(target._id);
    console.log(`✅ Deleted "${target.title}"`);
  }

  rl.close();
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
