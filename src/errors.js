"use strict";

function HTTPServerError(statusCode, message) {
  this.name = 'HTTPServerError';
  this.statusCode = statusCode;

  if (typeof message === 'object') {
    this.data = message;
  } else {
    this.message = message || `HTTP server error: ${statusCode}`;
  }

  this.stack = Error().stack;
}
HTTPServerError.prototype = Object.create(Error.prototype);
HTTPServerError.prototype.constructor = HTTPServerError;


function HTTPClientError(statusCode, message) {
  this.name = 'HTTPClientError';
  this.statusCode = statusCode;

  if (typeof message === 'object') {
    this.data = message;
  } else {
    this.message = message || `HTTP server error: ${statusCode}`;
  }

  this.stack = Error().stack;
}
HTTPClientError.prototype = Object.create(Error.prototype);
HTTPClientError.prototype.constructor = HTTPClientError;

module.exports = { HTTPServerError, HTTPClientError }
