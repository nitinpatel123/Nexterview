import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// One-time script to create the first admin account.
// Public signup always creates 'student' accounts for security —
// this script is the intended way to create an admin.
//
// Usage:
//   node utils/seedAdmin.js
//
// Make sure your .env is set up with MONGO_URI before running this.

import dotenv from "dotenv";
import mongoose from "mongoose";
import readline from "readline";
import User from "../models/User.model.js";

dotenv.config();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  const name = await ask("Admin name: ");
  const email = await ask("Admin email: ");
  const password = await ask("Admin password (min 6 chars): ");

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role === "admin") {
      console.log("\n⚠️  This user already exists and is already an admin.");
    } else {
      existing.role = "admin";
      await existing.save();
      console.log(`\n✅ Existing user '${email}' has been upgraded to admin.`);
    }
  } else {
    await User.create({ name, email, password, role: "admin" });
    console.log(`\n✅ Admin account created: ${email}`);
  }

  rl.close();
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
