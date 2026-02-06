/* eslint-env node */

import { defineConfig } from '#q-app/wrappers'

export default defineConfig(function (ctx) {
  return {
    css: ['app.scss'],
    boot: ['axios'],
    extras: [
      'material-icons'
    ],
    eslint: {
      warnings: true,
      errors: true
    },
    framework: {
      config: {},
      plugins: ['Notify', 'Dark']
    },
    build: {
      env: {
        API_URL: ctx.dev ? 'http://localhost:8000/api' : '/api'
      },
      vueRouterMode: 'hash'
    },
    devServer: {
      port: 9000,
      open: false
    }
  }
})
