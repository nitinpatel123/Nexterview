import api from "./api";

export const getTests = async () => {
  const { data } = await api.get("/tests");
  return data.data;
};

export const getTestById = async (id) => {
  const { data } = await api.get(`/tests/${id}`);
  return data.data;
};

export const submitTest = async (id, answers, timeTaken) => {
  const { data } = await api.post(`/tests/${id}/submit`, { answers, timeTaken });
  return data.data;
};

export const getMyResults = async () => {
  const { data } = await api.get("/tests/results/me");
  return data.data;
};

export const createTest = async (payload) => {
  const { data } = await api.post("/tests", payload);
  return data.data;
};
