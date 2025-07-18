import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Match the port mentioned in your CORS error
    host: true, // Allow external connections
    proxy: {
      '/api': {
        target: 'https://snapspace-ry3k.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path, // Keep the path as is
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('❌ Proxy error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🚀 Sending Request:', req.method, req.url);
            // Add CORS headers to the proxied request
            proxyReq.setHeader('Origin', 'http://localhost:5175');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Received Response:', proxyRes.statusCode, req.url);
            // Add CORS headers to the response
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5175');
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          });
        },
      },
    },
  },
})
