export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isStrongPassword = (password) => {
  // At least 6 chars — extend as needed
  return typeof password === "string" && password.length >= 6;
};

export const sanitizeInput = (str) => {
  if (typeof str !== "string") return str;
  return str.trim();
};
