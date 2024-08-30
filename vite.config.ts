import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import viteCompression from 'vite-plugin-compression'; // gzip 压缩
import viteCommonjs from 'vite-plugin-commonjs'; // 转换 CommonJS 模块
import { visualizer } from 'rollup-plugin-visualizer'; // 构建后分析 bundle

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteCompression({ threshold: 10240 }), // 启用 gzip 压缩，10KB 以上的文件
    viteCommonjs(), // 转换 CommonJS 模块
    visualizer(), // 构建后分析 bundle
    vueDevTools()
  ],
  base:'./',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    port:80,
    host:'0.0.0.0',
    proxy: {
      "/api":{
        changeOrigin: true,
        target: "http://localhost:8000"
      }
    },
    hmr: {
      overlay: false, // 关闭 HMR 的错误覆盖层，以减少干扰
    },
  },
  preview:{
    port:80,
    host:'0.0.0.0',
    proxy: {
      "/api":{
        changeOrigin: true,
        target: "http://localhost:8000"
      }
    },
  },
  build: {
    minify: 'terser', // 使用 terser 进行 JavaScript 代码压缩
    rollupOptions: {
      // 可以在这里进一步优化 rollup 的构建选项
      treeshake: {
        moduleSideEffects: true, // 深度摇树
      },
    },
    terserOptions: {
        compress: {
            drop_console: true,
            drop_debugger: true,
        },
    },
    chunkSizeWarningLimit: 1500, // 提醒大 chunk 的大小限制
  },
})
