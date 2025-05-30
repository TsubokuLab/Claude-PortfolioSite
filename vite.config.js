import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // カスタムドメイン用設定（teruaki-tsubokura.com）
  base: '/',
  plugins: [
    react(),

  ],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true
  }
})
