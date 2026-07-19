import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 项目站：https://898989L.github.io/mrliweb/
export default defineConfig({
  base: '/mrliweb/',
  plugins: [react()],
})
