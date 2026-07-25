import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "superdev-tagger"; // ⬅️ named import

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      // NOTE: 'Cross-Origin-Embedder-Policy: require-corp' was removed because it blocks
      // external images (Unsplash, Cloudinary) that don't send the CORP header.
    },
    host: true,
    port: 5173,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(), // ⬅️ use it here
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
