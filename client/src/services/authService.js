import api from "./api";

export const signup = async (payload) => {
  const { data } = await api.post("/auth/signup", payload);
  return data.data;
};

export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (email, otp, password) => {
  const { data } = await api.post("/auth/reset-password", { email, otp, password });
  return data;
};
