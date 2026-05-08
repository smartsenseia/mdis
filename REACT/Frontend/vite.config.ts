// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    server: {
      port: 5173, // Você deve acessar o site por http://localhost:5173
      open: true,
      strictPort: true,
      proxy: {
        // Toda vez que seu código React chamar "/api/v1/auth/login"
        "/api": {
          // O target DEVE ser a URL da sua API remota que está dando erro de CORS
          target: "https://api.seudominio.com", 
          changeOrigin: true,
          secure: true, // Como a API é HTTPS, deixe true
          
          /* IMPORTANTE: Se no seu FastAPI a rota já começa com "/api" 
            (ex: @app.post("/api/v1/login")), REMOVA ou comente o rewrite abaixo. 
            Se no FastAPI a rota começa direto no v1 (ex: @app.post("/v1/login")), 
            mantenha o rewrite.
          */
          // rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },

    build: {
      outDir: "dist",
      sourcemap: false,
      emptyOutDir: true,
    },

    preview: {
      port: 4173,
    },

    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV ?? ""),
    },
  };
});