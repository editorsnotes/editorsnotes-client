"use strict";

require('babel/register')({ only: /src/ });

var request = require('request')
  , server = require('../src/server')
  , apiURL = process.env.EDITORSNOTES_API_URL || 'http://127.0.0.1:8001'
  , port = process.env.EDITORSNOTES_RENDERER_PORT || 8450
  , production = process.env.NODE_ENV === 'production'

console.log(`Verifying Editors\' Notes API address at ${apiURL}`);

function start() {
  request(apiURL, { headers: { Accept: 'application/json' }}, function (err) {
    if (err) {
      if (err.code === 'ECONNREFUSED') {
        console.error(`\nCould not connect to Editor\'s Notes API server at ${apiURL}`)
        console.error('Retrying in 5 seconds...');

        setTimeout(start, 5000);
        return;
      } else {
        throw err;
      }
    }

    console.log(`Starting server on port ${port} (${production ? 'production' : 'development'} mode)`);
    server.serve(port, apiURL, !production)
  });
}

start();
