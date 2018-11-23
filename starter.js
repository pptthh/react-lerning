// https://timonweb.com/posts/how-to-enable-es6-imports-in-nodejs/
// Transpile all code following this line with babel and use 'env' (aka ES6) preset.

require('babel-register')({ presets: [ 'env' ] });

// Import the rest of our application.
module.exports = require('./srv.js');