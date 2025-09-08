import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/tornado-02-front/",
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), VitePWA({
    registerType: "autoUpdate",
    manifest: {
      name: "Viofolio",
      short_name: "Viofolio",
      description: "Viofolio - 学習量ではなく学習を計測するアプリ",
      theme_color: "#5A4A8A",
      background_color: "#6B569D",
      start_url: "/tornado-02-front/",
      icons: [
        {
          src: "viofolio_192.png",
          sizes: "192x192",
          type: "image/png"
        }
      ]
    }
  })],
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

