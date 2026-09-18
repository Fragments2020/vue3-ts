import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Vite 配置：https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 配置 @ 指向 src 目录，import 时更方便：import xxx from '@/xxx'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 9527,
    host: true
    // 真实项目中，跨域代理在这里配置，例如：
    // proxy: { '/api': { target: 'http://后端地址', changeOrigin: true } }
  }
})
