"use strict";

function defaultOpts() {
  const opts = {
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json; charset=utf-8',
    }
  }

  if (process.browser) {
    const cookie = require('cookie-cutter');

    opts.credentials = 'same-origin';
    opts.headers['X-CSRFToken'] = cookie.get('csrftoken')
  }

  return opts;
}

module.exports = function (url, extraOpts={}) {
  const opts = defaultOpts()

  Object.keys(extraOpts).forEach(key => {
    if (key.toLowerCase() === 'headers') {
      opts.headers = Object.assign({}, opts.headers, extraOpts[key]);
    } else {
      opts[key] = extraOpts[key];
    }
  });

  return fetch(url, opts);
}
