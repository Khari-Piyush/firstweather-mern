import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    minify: "esbuild",
    // exceljs is already dynamically imported (admin export-to-Excel only) and
    // lands in its own ~940kB chunk, well above the default 500kB threshold.
    chunkSizeWarningLimit: 1000,
  },
})
