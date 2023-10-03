import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import {ENV} from './src/constants/ENV';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mkcert()
  ],
  base: ENV.HOST,
  server: { 
    https: true,
    proxy: {
      '/oauth': {
        target: 'https://dev.login.rj.gov.br/auth/realms/rj/protocol/openid-connect', // URL da API que você deseja acessar
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/oauth/, ''),
      },
    },
   },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
