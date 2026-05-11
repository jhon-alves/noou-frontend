import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/agents-proxy": {
        target: "https://stg-development.noou.ai",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react")) return "react-lib"
          if (id.includes("node_modules/@tanstack")) return "tanstack-lib"
          if (id.includes("node_modules/lucide-react")) return "lucide-lib"
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
}))
