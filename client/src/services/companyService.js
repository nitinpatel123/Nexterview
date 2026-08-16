import api from "./api";

export const getCompanies = async () => {
  const { data } = await api.get("/companies");
  return data.data;
};

export const createCompany = async (payload) => {
  const { data } = await api.post("/companies", payload);
  return data.data;
};

export const updateCompany = async (id, payload) => {
  const { data } = await api.put(`/companies/${id}`, payload);
  return data.data;
};

export const deleteCompany = async (id) => {
  const { data } = await api.delete(`/companies/${id}`);
  return data.data;
};
