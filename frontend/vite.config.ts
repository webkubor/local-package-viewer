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
  plugins: [vue(),
    Components({
      resolvers: [PrimeVueResolver()],
      directoryAsNamespace: true
    })
  ],
})
