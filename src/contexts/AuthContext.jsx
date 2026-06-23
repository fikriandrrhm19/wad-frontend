import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { TokenStore } from "../lib/tokenStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!TokenStore.isLoggedIn()) { 
        setLoading(false); 
        return; 
      }
      
      try {
        const rfToken = TokenStore.getRefreshToken();
        const { data } = await axios.post("/auth/refresh", { refreshToken: rfToken });
        
        const newAccessToken = data.accessToken; 
        TokenStore.setAccessToken(newAccessToken);

        const { data: me } = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });
        
        setUser(me.data);
      } catch (error) {
        TokenStore.clear();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post("/auth/login", { email, password });
    
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    const userData = data.data;
    
    TokenStore.setAccessToken(accessToken);
    TokenStore.setRefreshToken(refreshToken);
    setUser(userData);
  }, []);

  const register = useCallback(async (name, email, password) => {
    await axios.post("/auth/register", { name, email, password });
  }, []);

  const logout = useCallback(async () => {
    try {
      const rfToken = TokenStore.getRefreshToken();
      await axios.post("/auth/logout", { refreshToken: rfToken }, {
        headers: { Authorization: `Bearer ${TokenStore.getAccessToken()}` },
      });
    } catch { 
      /* Mengabaikan error logout */ 
    }
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