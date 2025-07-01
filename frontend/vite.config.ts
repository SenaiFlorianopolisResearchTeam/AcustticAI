import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import oxlint from 'vite-plugin-oxlint'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), oxlint({ path: 'src' })],
})
