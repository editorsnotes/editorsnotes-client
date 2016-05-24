"use strict";

module.exports = process.browser
  ? require('./browser')
  : require('./server')
