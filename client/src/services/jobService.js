import api from "./api";

export const getRecommendedJobs = async () => {
  const { data } = await api.get("/jobs/recommended");
  return data.data;
};

export const applyToJob = async (jobId) => {
  const { data } = await api.post(`/jobs/${jobId}/apply`);
  return data;
};
