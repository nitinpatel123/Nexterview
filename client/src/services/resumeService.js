import api from "./api";

export const saveResume = async (payload) => {
  const { data } = await api.post("/resume", payload);
  return data.data;
};

export const getMyResume = async () => {
  const { data } = await api.get("/resume");
  return data.data;
};

export const downloadResumePDF = async () => {
  const response = await api.get("/resume/download", { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "resume.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
