import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl';
import fs from "fs"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
    },
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5000, // Change to your desired port
    hmr: {
      protocol: 'wss',
      host: '192.168.0.20' // replace with your local IP or localhost
    }
  }
})
