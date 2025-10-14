import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ✅ Ensure client-side routing works (React Router fix)
  server: {
    historyApiFallback: true, // 👈 fallback to index.html on unknown routes
    port: 5173, // optional
    open: true, // optional (auto opens browser)
  },
  preview: {
    historyApiFallback: true, // 👈 also for preview
  },
});
