import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Verify that the shared package exists
const sharedPath = path.resolve(__dirname, "packages/shared/src");
if (!fs.existsSync(sharedPath)) {
  throw new Error(`Shared package not found at: ${sharedPath}`);
}

export default defineConfig({
  plugins: [react()],
  base:
    process.env.NODE_ENV === "production" ? "/react-native-web-start/" : "/",
  define: {
    global: "globalThis",
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
    postcss: "./postcss.config.js",
  },
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "@shared": path.resolve(__dirname, "packages/shared/src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  optimizeDeps: {
    include: ["react-native-web"],
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
