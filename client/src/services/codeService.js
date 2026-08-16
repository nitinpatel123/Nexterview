import api from "./api";

export const runCode = async (code, language, stdin) => {
  const { data } = await api.post("/code/run", { code, language, stdin });
  return data.data;
};

export const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript (Node.js)" },
  { value: "python", label: "Python 3" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
];
