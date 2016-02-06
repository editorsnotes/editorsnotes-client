"use strict";

require('babel/register')({ only: /src/ });

var server = require('../src/server')

process.stdout.write(server.makeHTML(''));
