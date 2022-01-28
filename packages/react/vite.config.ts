import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: '@platform-form/react',
      fileName: (format) => `platform-form-react.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
})
