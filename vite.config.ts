import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/tornado-02-front/",
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    outDir: "build",
  },
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://tornado2025.chigayuki.com",
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
});

