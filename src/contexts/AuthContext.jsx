import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/axios";
import { TokenStore } from "../lib/tokenStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!TokenStore.isLoggedIn()) { setLoading(false); return; }
      try {
        const rfToken = TokenStore.getRefreshToken();
        const { data } = await api.post("/auth/refresh", { refreshToken: rfToken });
        const newAccessToken = data.accessToken; 
        TokenStore.setAccessToken(newAccessToken);
        const { data: me } = await api.get("/auth/me");
        setUser(me.data);
      } catch (error) {
        TokenStore.clear();
      } finally { setLoading(false); }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    TokenStore.setAccessToken(data.accessToken);
    TokenStore.setRefreshToken(data.refreshToken);
    setUser(data.data);
  }, []);

  const register = useCallback(async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
  }, []);

  const logout = useCallback(async () => {
    try {
      const rfToken = TokenStore.getRefreshToken();
      await api.post("/auth/logout", { refreshToken: rfToken });
    } catch { /* Ignore logout error */ }
    TokenStore.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return ctx;
}