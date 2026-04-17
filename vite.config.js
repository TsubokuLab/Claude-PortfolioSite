import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// public/images/works/ 以下をスキャンして image-manifest.json を生成するプラグイン
// フォルダ名 = work id の規則で新規作品を追加すれば自動検出される
function imageManifestPlugin() {
  const generate = () => {
    const worksDir = path.resolve('./public/images/works')
    const manifest = {}
    if (fs.existsSync(worksDir)) {
      for (const entry of fs.readdirSync(worksDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue
        const files = fs.readdirSync(path.join(worksDir, entry.name))
          .filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f))
          .sort()
        manifest[entry.name] = files.map(f => `images/works/${entry.name}/${f}`)
      }
    }
    fs.writeFileSync(
      path.resolve('./public/data/image-manifest.json'),
      JSON.stringify(manifest, null, 2)
    )
  }

  return {
    name: 'image-manifest',
    buildStart() { generate() },
    configureServer(server) {
      generate()
      server.watcher.on('add', f => {
        if (f.includes(`${path.sep}public${path.sep}images${path.sep}works${path.sep}`)) generate()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), imageManifestPlugin()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true
  }
})
