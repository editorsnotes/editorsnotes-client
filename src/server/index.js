"use strict";

require('babel/register')({
  only: /src/
});

var request = require('request')
  , server = require('./server')

const API_URL = process.env.EDITORSNOTES_API_URL || 'http://localhost:8001'


console.log('Starting server...')
console.log('Verifying Editors\' Notes API address at ' + API_URL + '...')


request(API_URL, { headers: { Accept: 'application/json' }}, function (err) {
  if (err) {
    if (err.code === 'ECONNREFUSED') {
      throw new Error('Could not connect to Editor\'s Notes API server at ' + API_URL);
    } else {
      throw err;
    }
  }

  console.log('Server started');
  server.serve()
});

