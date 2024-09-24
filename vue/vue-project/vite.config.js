import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // vue2 的代理设置方法
  // devServer: {
  //   proxy: 'http://localhost:8001',
  // }

  // vue3的代理方法
  server: {
    host: '0.0.0.0',
    port: 8081,
    cors: true,
    // proxy: 'http://127.0.0.1:8001/'
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:8001/',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   }
    // }
  }
})
