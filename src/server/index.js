"use strict";

require('babel/register')({ only: /src/ });

global.EditorsNotes = {};
global.EditorsNotes.jed = require('./jed')


var request = require('request')
  , server = require('./server')
  , argv = require('minimist')(process.argv.slice(2), {
    default: {
      api_url: 'http://127.0.0.1:8001',
      port: '8450',
      dev: false
    }
  })

console.log(`Verifying Editors\' Notes API address at ${argv.api_url}`);

function start() {
  request(argv.api_url, { headers: { Accept: 'application/json' }}, function (err) {
    if (err) {
      if (err.code === 'ECONNREFUSED') {
        console.error(`\nCould not connect to Editor\'s Notes API server at ${argv.api_url}`)
        console.error('Retrying in 5 seconds...');

        setTimeout(start, 5000);
        return;
      } else {
        throw err;
      }
    }

    console.log(`Starting server on port ${argv.port} (${argv.dev ? 'development' : 'production'} mode)`);
    server.serve(argv.port, argv.api_url, argv.dev)
  });
}

start();
