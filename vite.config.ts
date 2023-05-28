import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export const aliases = {
  "@assets": resolve(__dirname, "./src/assets"),
  "@components": resolve(__dirname, "./src/components"),
  "@shared": resolve(__dirname, "./src/shared"),
};

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: aliases },
  plugins: [react()],
});
