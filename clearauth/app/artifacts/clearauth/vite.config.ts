import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Defaults let the app run anywhere; hosts can still set
// PORT and BASE_PATH (e.g. "/clearauth/" for a GitHub Pages sub-folder).
const port = Number(process.env.PORT ?? 5173);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env.PORT}"`);
}
const basePath = process.env.BASE_PATH ?? "/";
const apiTarget = process.env.API_URL ?? "http://localhost:8080";

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true, deny: ["**/.*"] },
    proxy: { "/api": { target: apiTarget, changeOrigin: true } },
  },
  preview: { port, host: "0.0.0.0", allowedHosts: true },
});
