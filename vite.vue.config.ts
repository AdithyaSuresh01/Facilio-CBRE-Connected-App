import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-vue",
    rollupOptions: {
      input: path.resolve(__dirname, "index-vue.html"),
    },
  },
  assetsInclude: ["**/*.svg", "**/*.csv"],
});
