import React, { createContext, useEffect, useState } from "react";
import api from "../api.improved";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // User profile stored in localStorage for page-refresh persistence.
  // Token is NOT stored here — it lives in the httpOnly cookie.
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("fw_user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("fw_user", JSON.stringify(user));
    else localStorage.removeItem("fw_user");
  }, [user]);

  // login: store user profile only — token is in httpOnly cookie
  const login = ({ user: u }) => {
    setUser(u);
  };

  // logout: clear cookie server-side + clear local state
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {
      // best-effort — clear local state regardless
    }
    setUser(null);
  };

  // Auto-logout on 401 (expired or invalid token)
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response && err.response.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
