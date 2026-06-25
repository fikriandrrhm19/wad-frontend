import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { TokenStore } from "../lib/tokenStore";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineCount, setOnlineCount] = useState(0);

    useEffect(() => {
        if (!user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setIsConnected(false);
            return;
        }

        const socket = io("http://localhost:3000", {
            auth: (cb) => {
                cb({ token: TokenStore.getAccessToken() });
            },
            transports: ["websocket", "polling"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        socketRef.current = socket;

        // ── SOCKET EVENT LISTENERS ─────────────────────────────────
        socket.on("connect", () => {
            console.log("[Socket] Handshake berhasil. Terhubung dengan ID:", socket.id);
            setIsConnected(true);
        });

        socket.on("disconnect", (reason) => {
            console.log("[Socket] Koneksi terputus. Alasan:", reason);
            setIsConnected(false);
        });

        socket.on("connect_error", (err) => {
            console.error("[Socket] Gagal melakukan jabat tangan keamanan:", err.message);
            setIsConnected(false);
        });

        socket.on("users:online", ({ count }) => {
            setOnlineCount(count);
        });

        // ── CLEANUP FUNCTION ───────────────────────────────────────
        return () => {
            if (socket) {
                socket.disconnect();
            }
            socketRef.current = null;
        };
    }, [user]); 

    useEffect(() => {
        const handleTokenRefresh = (e) => {
            if (socketRef.current) {
                console.log("[Socket] Memperbarui auth payload dengan token baru hasil rotasi.");
                socketRef.current.auth = { token: e.detail.token };
                
                socketRef.current.disconnect().connect();
            }
        };

        window.addEventListener("token:refreshed", handleTokenRefresh);
        
        return () => {
            window.removeEventListener("token:refreshed", handleTokenRefresh);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected, onlineCount }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const ctx = useContext(SocketContext);
    if (!ctx) {
        throw new Error("useSocket harus digunakan di dalam struktur komponen SocketProvider");
    }
    return ctx;
}