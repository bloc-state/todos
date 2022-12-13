import { defineConfig, PluginOption } from "vite"
import react from "@vitejs/plugin-react"
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      keep_classnames: true,
    },
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    visualizer() as PluginOption,
  ],
})
