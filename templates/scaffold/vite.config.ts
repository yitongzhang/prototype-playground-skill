import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Relative base so the built dist/ loads at any path: the domain root
    // (Netlify, a file server) or a subpath (GitHub Pages at /<repo>/).
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      proxy: {
        // Dev-only bridge to GitHub Models for the live agent transport.
        // Put GITHUB_MODELS_TOKEN=<PAT with models:read> in .env.local
        // (gitignored); the token stays server-side in the dev proxy and is
        // never part of the client bundle or the deployed build.
        '/github-models': {
          target: 'https://models.github.ai',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/github-models/, '/inference'),
          ...(env.GITHUB_MODELS_TOKEN
            ? { headers: { Authorization: `Bearer ${env.GITHUB_MODELS_TOKEN}` } }
            : {}),
        },
      },
    },
  }
})
