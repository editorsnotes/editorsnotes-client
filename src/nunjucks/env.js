"use strict";

var typogr = require('typogr')
  , extensions = require('./extensions')

module.exports = function (router, jed) {
  var env;

  if (process.browser) {
    env = require('./client-env');
  } else {
    env = require('./server-env');
  }

  env.addExtension('url', new extensions.URL(router));
  env.addExtension('trans', new extensions.Trans(jed));
  env.addFilter('typogrify', function (str) {
    return typogr.typogrify(str);
  });

  return env;
}
