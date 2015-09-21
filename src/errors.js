"use strict";

function HTTPServerError(code, message) {
  this.name = 'HTTPServerError';
  this.code = code;

  if (typeof message === 'object') {
    this.data = message;
  } else {
    this.message = message || `HTTP server error: ${code}`;
  }

  this.stack = Error().stack;
}
HTTPServerError.prototype = Object.create(Error.prototype);
HTTPServerError.prototype.constructor = HTTPServerError;


function HTTPClientError(code, message) {
  this.name = 'HTTPClientError';
  this.code = code;

  if (typeof message === 'object') {
    this.data = message;
  } else {
    this.message = message || `HTTP server error: ${code}`;
  }

  this.stack = Error().stack;
}
HTTPClientError.prototype = Object.create(Error.prototype);
HTTPClientError.prototype.constructor = HTTPClientError;

module.exports = { HTTPServerError, HTTPClientError }
