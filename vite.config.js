import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Semua request ke /api/... diteruskan ke backend Express (Port 3000)
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      // Semua request ke /auth/... diteruskan ke backend Express (Port 3000)
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});