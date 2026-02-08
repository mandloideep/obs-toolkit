import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'url'

const config = defineConfig({
  // GitHub Pages deployment configuration
  // Use base path only in production
  base: process.env.NODE_ENV === 'production' ? '/obs-toolkit/' : '/',

  build: {
    outDir: 'dist',
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  plugins: [
    devtools(),
    // TanStack Router plugin for route tree generation
    TanStackRouterVite(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    viteReact(),
  ],
})

export default config
