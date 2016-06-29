"use strict";

const { HTTPClientError, HTTPServerError } = require('../errors')

// If response is OK (2xx status code), pass it through. If not, return a
// rejected promise that includes both the status and the message received
// from the server (which would typically be a JSON object)
module.exports = function (response) {
  if (response.ok) return Promise.resolve(response);

  const isJSON = /json/.test(response.headers.get('Content-Type'))

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
