import api from "./api";

export const getProfile = async () => {
  const { data } = await api.get("/student/profile");
  return data.data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put("/student/profile", payload);
  return data.data;
};

export const getDashboardSummary = async () => {
  const { data } = await api.get("/student/dashboard-summary");
  return data.data;
};

export const uploadCertificate = async (file, title) => {
  const formData = new FormData();
  formData.append("certificate", file);
  formData.append("title", title);
  const { data } = await api.post("/student/certificates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const deleteCertificate = async (certId) => {
  const { data } = await api.delete(`/student/certificates/${certId}`);
  return data.data;
};
