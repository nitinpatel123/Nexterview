import api from "./api";

export const analyzeResume = async (targetRole) => {
  const { data } = await api.post("/ai/resume-analysis", { targetRole });
  return data.data;
};

export const skillGap = async (targetRole) => {
  const { data } = await api.post("/ai/skill-gap", { targetRole });
  return data.data;
};

export const careerRoadmap = async (targetRole, experienceLevel) => {
  const { data } = await api.post("/ai/career-roadmap", { targetRole, experienceLevel });
  return data.data;
};

export const getInterviewQuestions = async (role, type, count) => {
  const { data } = await api.post("/ai/interview-questions", { role, type, count });
  return data.data;
};

export const evaluateAnswer = async (question, answer, role, type) => {
  const { data } = await api.post("/ai/evaluate-answer", { question, answer, role, type });
  return data.data;
};

export const generateCoverLetter = async (jobDescription) => {
  const { data } = await api.post("/ai/cover-letter", { jobDescription });
  return data.data;
};

export const getLinkedInSuggestions = async (headline, about) => {
  const { data } = await api.post("/ai/linkedin-suggestions", { headline, about });
  return data.data;
};

export const checkResumeATS = async (file, targetRole) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("targetRole", targetRole);
  const { data } = await api.post("/ai/ats-checker", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const matchResumeToJD = async (jobDescription) => {
  const { data } = await api.post("/ai/resume-jd-match", { jobDescription });
  return data.data;
};

export const sendCareerChatMessage = async (message, history) => {
  const { data } = await api.post("/ai/career-chat", { message, history });
  return data.data;
};
