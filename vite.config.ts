import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import swc from "unplugin-swc";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      keep_classnames: true,
    },
  },
  plugins: [
    react(),
    swc.vite(),
    visualizer() as PluginOption,
  ],
});
