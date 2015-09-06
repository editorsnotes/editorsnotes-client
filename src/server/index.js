"use strict";

require('babel/register')({
  only: /src/
});


global.EditorsNotes = {};
global.EditorsNotes.jed = require('./jed')


var request = require('request')
  , server = require('./server')

const API_URL = process.env.EDITORSNOTES_API_URL || 'http://localhost:8001'

console.log('Starting server...')
console.log('Verifying Editors\' Notes API address at ' + API_URL + '...')

function start() {
  request(API_URL, { headers: { Accept: 'application/json' }}, function (err) {
    if (err) {
      if (err.code === 'ECONNREFUSED') {
        console.error('Could not connect to Editor\'s Notes API server at ' + API_URL);
        console.error('Retrying in 5 seconds...');

        setTimeout(start, 5000);
        return;
      } else {
        throw err;
      }
    }

    console.log('Server started');
    server.serve()
  });
}

start();
