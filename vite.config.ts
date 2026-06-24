import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";

import manifest from "./manifest";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendProxyTarget = env.VITE_BACKEND_PROXY_TARGET ?? "http://localhost:5001";

  return {
    plugins: [react(), crx({ manifest })],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: backendProxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: {
          popup: fileURLToPath(new URL("./src/ui/popup/index.html", import.meta.url)),
          dashboard: fileURLToPath(new URL("./src/ui/dashboard/index.html", import.meta.url)),
          login: fileURLToPath(new URL("./src/ui/login/index.html", import.meta.url)),
          forgotPassword: fileURLToPath(
            new URL("./src/ui/forgot-password/index.html", import.meta.url),
          ),
          resetPassword: fileURLToPath(
            new URL("./src/ui/reset-password/index.html", import.meta.url),
          ),
          contact: fileURLToPath(new URL("./src/ui/contact/index.html", import.meta.url)),
          options: fileURLToPath(new URL("./src/ui/options/index.html", import.meta.url)),
        },
      },
    },
  };
});
