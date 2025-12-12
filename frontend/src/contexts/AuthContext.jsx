import React, { createContext, useEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // load from localStorage once during init
    try {
      const u = localStorage.getItem("fw_user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  // keep token in localStorage too
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // keep axios header in sync
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("fw_user", JSON.stringify(user));
    else localStorage.removeItem("fw_user");
  }, [user]);

  // helper: login (set user & token)
  const login = ({ token: t, user: u }) => {
    setToken(t);
    setUser(u);
  };

  // helper: logout
  const logout = () => {
    setToken(null);
    setUser(null);
    // optional: call backend logout if you implement it later
  };

  // auto-logout on 401 responses from axios
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response && err.response.status === 401) {
          // token invalid or expired
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
