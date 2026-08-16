import dotenv from "dotenv";
dotenv.config();

// Defaults to a self-hosted Judge0 instance (free, no billing) running via
// Docker at http://localhost:2358. If JUDGE0_API_KEY is set, it switches to
// using RapidAPI's hosted Judge0 CE instead (paid, per-use).
const JUDGE0_BASE_URL = process.env.JUDGE0_URL || "http://localhost:2358";
const USE_RAPIDAPI = !!process.env.JUDGE0_API_KEY;

const JUDGE0_URL = USE_RAPIDAPI
  ? "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true"
  : `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`;

// Common Judge0 language IDs
export const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71, // Python 3
  java: 62, // OpenJDK
  cpp: 54, // C++ (GCC)
  c: 50, // C (GCC)
};

/**
 * Executes source code against given stdin using Judge0.
 * Works against either a self-hosted instance or RapidAPI's hosted one,
 * depending on whether JUDGE0_API_KEY is configured.
 * @param {string} sourceCode
 * @param {number} languageId - one of LANGUAGE_IDS values
 * @param {string} stdin
 * @returns {Promise<{stdout, stderr, compileOutput, status, time, memory}>}
 */
export const executeCode = async (sourceCode, languageId, stdin = "") => {
  const headers = { "Content-Type": "application/json" };

  if (USE_RAPIDAPI) {
    headers["X-RapidAPI-Key"] = process.env.JUDGE0_API_KEY;
    headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com";
  }

  let response;
  try {
    response = await fetch(JUDGE0_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin,
      }),
    });
  } catch (err) {
    throw new Error(
      `Could not reach Judge0 at ${JUDGE0_BASE_URL}. If using self-hosted Judge0, make sure Docker containers are running (docker-compose up -d). Original error: ${err.message}`
    );
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Judge0 API error: ${errText}`);
  }

  const data = await response.json();

  return {
    stdout: data.stdout || "",
    stderr: data.stderr || "",
    compileOutput: data.compile_output || "",
    status: data.status?.description || "Unknown",
    time: data.time,
    memory: data.memory,
  };
};
