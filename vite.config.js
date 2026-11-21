import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// base './' → läuft auf GitHub Pages unter /repo-name/ ebenso wie lokal
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mein Kochbuch',
        short_name: 'Kochbuch',
        lang: 'de',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#fff8f0',
        theme_color: '#c0392b',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg}'] }
    })
  ]
})
