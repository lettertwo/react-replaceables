'use strict';  // eslint-disable-line strict

require('babel-register')({
  presets: [
    'modern-node/5.7',
    'react',
  ],
  plugins: [
    'babel-plugin-espower',
  ],
});

// Create a browser-like environment, if necessary.
if (!global.window) {
  global.document = require('jsdom').jsdom('<!doctype html><html><body></body></html>');
  global.window = document.defaultView;

  for (let key in global.window) {
    if (!global.window.hasOwnProperty(key)) continue;
    if (key in global) continue;
    global[key] = global.window[key];
  }
}
