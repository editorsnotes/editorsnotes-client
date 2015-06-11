"use strict";

var request = require('request')

module.exports = function (url, opts, payload) {
  return new Promise(function (resolve, reject) {
    var req = request(url, opts, function (err, resp, body) {
      if (err) reject([err, this]);
      resolve([body, resp]);
    });

    if (payload && req.writable) {
      req.writeHeader('Content-Length', payload.length);
      req.end(payload);
    } else if (req.writable) {
      req.end();
    }
  });
}
