import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
// BASE_PATH lets the app be served from a sub-folder, e.g. "/cortex/" on GitHub Pages.
export default defineConfig(() => ({
  base: process.env.BASE_PATH ?? "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query"],
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query"],
  },
}));
