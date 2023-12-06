// const path = require('path')
import path from 'path'
import { defineConfig } from 'vite'
// const { defineConfig } = require('vite')

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'webxrWebAR',
      fileName: (format) => `webxr-webAR.${format}.js`
    },
    sourcemap: false
  }
});