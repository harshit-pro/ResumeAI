import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Don't forget to import path

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Your Spring Boot port
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Optional: removes /api prefix
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Shortcut to reference src folder from anywhere
    },
  },
});