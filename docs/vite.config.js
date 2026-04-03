import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // 👈 allow external access (Jenkins)
    port: 5173
  },
  base: "/"       // 👈 FIX THIS
});