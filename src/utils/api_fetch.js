"use strict";

var _ = require('underscore')

function defaultOpts() {
  var cookie = require('cookie-cutter');

  return {
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json; charset=utf-8',
      'X-CSRFToken': cookie.get('csrftoken')
    }
  }
}

module.exports = function (url, opts) {
  return fetch(url, _.extend(defaultOpts(), opts))
}
