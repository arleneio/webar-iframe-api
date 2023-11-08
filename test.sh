# Build the library
npm run build

# Copy libary UMD output to test folder
cp dist/arlene-360.es.js demo/
cp dist/arlene-360.umd.js demo/

# Start the HTTP server... if this command fails, please install the server first: npm i -g http-server
http-server ./demo/