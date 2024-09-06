import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/vite-plugin-vue-i18n'
import pluginRewriteAll from 'vite-plugin-rewrite-all'

const hash = Math.floor(Math.random() * 90000) + 10000
// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    pluginRewriteAll(),
    vue(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
  ],
})
