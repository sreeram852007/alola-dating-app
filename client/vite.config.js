import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "public",
  build: {
    outDir: "../server/public",
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: "index.html"
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
