import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy /api → FastAPI on :8000 so the frontend can fetch same-origin in dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:8050", changeOrigin: true },
    },
  },
});
