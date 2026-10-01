import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'bg.png', 'logoo.png'],
      manifest: {
        name: 'Ibra Book Store',
        short_name: 'IbraBook',
        description: 'Books and Authors SPA Platform',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/logoo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logoo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})