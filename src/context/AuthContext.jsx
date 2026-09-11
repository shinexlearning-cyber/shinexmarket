import React, { useState, useEffect, useCallback, useContext, createContext } from "react";
import { api } from "../services/api";

/* ------------------------------------------------------------
   AUTH CONTEXT
   Backend user fields: id, username, email, full_name, phone,
   avatar_url, bio, location, whatsapp, shop_name,
   shop_description, is_admin, is_suspended, created_at
   ------------------------------------------------------------ */
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("shinex_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api("/auth/me");
      setUser(data.user);
    } catch (e) {
      localStorage.removeItem("shinex_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = async (email, password) => {
    const { data } = await api("/auth/login", { method: "POST", body: { email, password }, auth: false });
    if (data.token) localStorage.setItem("shinex_token", data.token);
    setUser(data.user || null);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api("/auth/register", { method: "POST", body: payload, auth: false });
    if (data.token) localStorage.setItem("shinex_token", data.token);
    setUser(data.user || null);
    return data;
  };

  const loginWithGoogle = async (credential) => {
    const { data } = await api("/auth/google", { method: "POST", body: { credential }, auth: false });
    if (data.token) localStorage.setItem("shinex_token", data.token);
    setUser(data.user || null);
    return data;
  };

  const logout = () => {
    api("/auth/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("shinex_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, loginWithGoogle, logout, refresh: loadMe }}>
      {children}
    </AuthContext.Provider>
  );
}
