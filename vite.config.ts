import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base:
    process.env.NODE_ENV === "production" ? "/react-native-web-start/" : "/",
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "@monorepo/shared": path.resolve(__dirname, "packages/shared/src"),
    },
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
