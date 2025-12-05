import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Cấu hình Vite cho React frontend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API requests tới backend FastAPI
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
