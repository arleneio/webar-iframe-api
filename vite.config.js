const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'webxrWebAR',
      fileName: (format) => `webxr-webAR.${format}.js`
    },
    sourcemap: false
  }
});