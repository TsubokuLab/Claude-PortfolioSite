import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pagesにデプロイする場合、リポジトリ名をbaseに設定
  // 本番環境ではリポジトリ名に変更する必要があります
  base: '/Claude-PortfolioSite/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  }
})
