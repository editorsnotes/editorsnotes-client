"use strict";

const { HTTPClientError, HTTPServerError } = require('../errors')

module.exports = function (response) {
  if (response.ok) return response;

  const contentType = response.headers.get('Content-Type') || ''
      , isJSON = contentType.indexOf('json') !== -1;

  return (isJSON ? response.json() : response.text())
    .then(msg => {
      if (response.status >= 400 && response.status <= 499) {
        throw new HTTPClientError(response.status, msg);
      } else if (response.status >= 500 && response.status <= 599) {
        throw new HTTPServerError(response.status, msg);
      } else {
        throw new Error(msg);
      }
    })
}
