import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    open: true,  //是否打开浏览器
    port: 3000,  //端口号
    cors: true   //跨域
  },
  base: './',  //根路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src") // 转换 '@' to './src' 
    }
  }
})
