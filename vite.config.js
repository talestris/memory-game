import { defineConfig } from "vite";

export default defineConfig({
  base: "/memory-game/",

  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
});
