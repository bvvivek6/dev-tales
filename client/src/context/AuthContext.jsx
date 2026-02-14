import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem("userInfo");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await api.post("/auth/login", { username, password });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

      return { success: true, user: data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  const register = async (username, password) => {
    try {
      const { data } = await api.post("/auth/register", { username, password });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

      return { success: true, user: data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
