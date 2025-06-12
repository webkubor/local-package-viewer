import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {PrimeVueResolver} from '@primevue/auto-import-resolver';
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  server: {
    port: 3000, // 前端使用3000端口，避免与后端的5200端口冲突
    open: true, // 自动打开浏览器
    host: true, // 监听所有地址
  },
  plugins: [vue(),
    Components({
      resolvers: [PrimeVueResolver()],
      directoryAsNamespace: true
    })
  ],
})
