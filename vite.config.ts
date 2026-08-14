import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // CodeMirror 6のバンドルはある程度の大きさになるのが通常のため、警告閾値を引き上げる。
    chunkSizeWarningLimit: 900,
  },
});
