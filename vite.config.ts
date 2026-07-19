import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 本地仍用 http://localhost:5173/ ；线上 GitHub Pages 用 /mrliweb/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/mrliweb/' : '/',
  plugins: [react()],
}))
