"use strict";

var hyperquest = require('hyperquest')

module.exports = function (url, opts, payload) {
  return new Promise(function (resolve, reject) {
    var req = hyperquest(url, opts, function (err, resp) {
      if (err) reject([err, req]);

      resolve([resp.data, resp, req])
    });

    if (payload && req.writable) {
      req.writeHeader('Content-Length', payload.length);
      req.end(payload);
    } else if (req.writable) {
      req.end();
    }
  });
}
