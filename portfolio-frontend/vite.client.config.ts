import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  base: '/static/',
  build: {
    outDir: 'dist-client',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/client-entry.tsx'),
      output: {
        entryFileNames: 'client.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
