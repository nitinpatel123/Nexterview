import { createContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("cf_user");
    const token = localStorage.getItem("cf_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (payload) => {
    const data = await authService.login(payload);
    localStorage.setItem("cf_token", data.token);
    localStorage.setItem("cf_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const signup = async (payload) => {
    const data = await authService.signup(payload);
    localStorage.setItem("cf_token", data.token);
    localStorage.setItem("cf_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("cf_token");
    localStorage.removeItem("cf_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
