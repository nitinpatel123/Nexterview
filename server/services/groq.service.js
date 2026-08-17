import dotenv from "dotenv";
dotenv.config();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_MODEL = "openai/gpt-oss-120b";
/**
 * Core function to call Groq API with a prompt
 * @param {string} prompt
 * @returns {Promise<string>} raw text response from the model
 */
const callGroq = async (prompt, temperature = 0.7) => {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error: ${errText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) throw new Error("Groq returned an empty response");
  return text;
};

/**
 * Helper: safely parse JSON out of a model text response
 * (strips markdown code fences if present, and repairs raw control
 * characters — like literal newlines — that models sometimes leave
 * unescaped inside JSON string values)
 */
const sanitizeControlCharsInStrings = (text) => {
  let result = "";
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (isEscaped) {
        result += char;
        isEscaped = false;
        continue;
      }
      if (char === "\\") {
        result += char;
        isEscaped = true;
        continue;
      }
      if (char === '"') {
        inString = false;
        result += char;
        continue;
      }
      // Escape/strip raw control characters found inside a string literal
      const code = char.charCodeAt(0);
      if (code < 0x20) {
        if (char === "\n") result += "\\n";
        else if (char === "\r") result += "\\r";
        else if (char === "\t") result += "\\t";
        else if (char === "\b") result += "\\b";
        else if (char === "\f") result += "\\f";
        // any other stray control character is dropped — it's not
        // meaningful visible text and JSON can't contain it raw
        continue;
      }
      result += char;
    } else {
      if (char === '"') inString = true;
      result += char;
    }
  }

  return result;
};

const parseJSONResponse = (rawText) => {
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Retry after repairing unescaped control characters inside strings
    try {
      return JSON.parse(sanitizeControlCharsInStrings(cleaned));
    } catch (err) {
      throw new Error("Failed to parse AI response as JSON: " + err.message);
    }
  }
};

// ---------------- AI FEATURE FUNCTIONS ----------------
// Function names kept identical to the previous Gemini service
// so ai.controller.js doesn't need any changes besides the import.

export const analyzeResumeATS = async (resumeText, targetRole = "Software Engineer") => {
  const prompt = `
You are an expert ATS (Applicant Tracking System) resume reviewer.
Analyze the following resume for the target role: "${targetRole}".

Resume:
"""
${resumeText}
"""

Return ONLY valid JSON (no markdown, no preamble) in this exact format:
{
  "atsScore": <number 0-100>,
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}
`;
  const raw = await callGroq(prompt);
  return parseJSONResponse(raw);
};

export const analyzeSkillGap = async (currentSkills, targetRole) => {
  const prompt = `
A student has these current skills: ${currentSkills.join(", ")}.
Their target job role is: "${targetRole}".

Return ONLY valid JSON in this format:
{
  "missingSkills": ["skill1", "skill2"],
  "recommendedCourses": ["course1", "course2"],
  "priorityOrder": ["skill to learn first", "skill to learn second"]
}
`;
  const raw = await callGroq(prompt);
  return parseJSONResponse(raw);
};

export const generateCareerRoadmap = async (currentSkills, targetRole, experienceLevel = "beginner") => {
  const prompt = `
Create a career roadmap for a ${experienceLevel} level student aiming to become a "${targetRole}".
Current skills: ${currentSkills.join(", ")}.

Return ONLY valid JSON in this format:
{
  "roadmap": [
    { "phase": "Phase 1: Foundations", "duration": "1-2 months", "topics": ["topic1", "topic2"] },
    { "phase": "Phase 2: Core Skills", "duration": "2-3 months", "topics": ["topic1", "topic2"] }
  ],
  "estimatedTotalDuration": "6 months"
}
`;
  const raw = await callGroq(prompt);
  return parseJSONResponse(raw);
};

export const generateInterviewQuestions = async (role, type = "technical", count = 5) => {
  const sessionSeed = Math.floor(Math.random() * 100000);
  const prompt = `
Generate ${count} ${type} interview questions for the role: "${role}".
Make them varied and not the most cliché/repeated ones — mix difficulty levels and angles.
(session variation seed: ${sessionSeed} — use this to pick a different angle/subset than usual)

Return ONLY valid JSON in this format:
{
  "questions": [
    { "question": "...", "expectedAnswerPoints": ["point1", "point2"] }
  ]
}
`;
  const raw = await callGroq(prompt, 1.0);
  return parseJSONResponse(raw);
};

export const evaluateInterviewAnswer = async (question, userAnswer) => {
  const prompt = `
Interview Question: "${question}"
Candidate's Answer: "${userAnswer}"

Evaluate this answer as a strict but fair technical interviewer.
Return ONLY valid JSON in this format:
{
  "score": <number 0-10>,
  "feedback": "constructive feedback in 2-3 sentences",
  "improvedAnswer": "a brief example of a stronger answer"
}
`;
  const raw = await callGroq(prompt);
  return parseJSONResponse(raw);
};

export const generateCoverLetter = async (studentProfile, jobDescription) => {
  const prompt = `
Write a professional, concise cover letter (max 300 words) for this candidate applying to the job below.

Candidate profile: ${JSON.stringify(studentProfile)}
Job description: "${jobDescription}"

Return ONLY valid JSON in this format:
{ "coverLetter": "full cover letter text here" }
`;
  const raw = await callGroq(prompt);
  return parseJSONResponse(raw);
};

export const suggestLinkedInImprovements = async (headline, about, skills) => {
  const prompt = `
Review this LinkedIn profile and suggest improvements.
Headline: "${headline}"
About section: "${about}"
Skills: ${skills.join(", ")}

Return ONLY valid JSON in this format:
{
  "improvedHeadline": "...",
  "improvedAbout": "...",
  "suggestedSkillsToAdd": ["skill1", "skill2"]
}
`;
  const raw = await callGroq(prompt);
  return parseJSONResponse(raw);
};

export const matchResumeToJD = async (resumeText, jobDescription) => {
  const prompt = `
Compare this resume against the job description and estimate a match percentage.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return ONLY valid JSON in this format:
{
  "matchPercentage": <number 0-100>,
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2"]
}
`;
  const raw = await callGroq(prompt);
  return parseJSONResponse(raw);
};

export const careerChatReply = async (message, history = []) => {
  const historyText = history
    .slice(-6) // keep last 6 turns for context, avoid unbounded prompt growth
    .map((h) => `${h.role === "user" ? "Student" : "Career Advisor"}: ${h.content}`)
    .join("\n");

  const prompt = `
You are a friendly, knowledgeable career advisor helping a student with placement/career questions
(resume, interviews, skills, job search, career decisions). Keep answers concise (3-6 sentences)
and practical. Do not return JSON — just respond in plain, conversational text.

${historyText ? `Conversation so far:\n${historyText}\n` : ""}
Student: ${message}
Career Advisor:
`;
  return callGroq(prompt); // plain text, not JSON
};

export default {
  analyzeResumeATS,
  analyzeSkillGap,
  generateCareerRoadmap,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateCoverLetter,
  suggestLinkedInImprovements,
  matchResumeToJD,
  careerChatReply,
};
