import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'

// https://cn.vitejs.dev/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    open: false, //是否打开浏览器
    port: 3000, //端口号
    cors: true, //跨域
    host: '0.0.0.0', //ip地址
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // 转换 '@' to 'src'
    },
  },
  build: {
    chunkSizeWarningLimit: 2 * 1024 * 1024,
    rollupOptions: {
      output: {
        manualChunks: {
          'floating-ui': ['@floating-ui/dom'],
        },
      },
    },
  },
})
