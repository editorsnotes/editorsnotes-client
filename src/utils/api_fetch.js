"use strict";

var _ = require('underscore')
  , url = require('url')
  , path = require('path')

function defaultOpts() {
  var cookie = require('cookie-cutter')
    , { currentRemoteServer } = window.EditorsNotes
    , opts

    opts = {
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=utf-8',
      }
    }

    if (currentRemoteServer) {
      opts.headers.Authorization = `Token: ${currentRemoteServer.token}`;
    } else {
      opts.headers['X-CSRFToken'] = cookie.get('csrftoken');
    }

    return opts;
}

module.exports = function (requestedPath, opts) {
  var { currentRemoteServer } = window.EditorsNotes
    , reqURL

  if (currentRemoteServer) {
    let urlObj = url.parse(currentRemoteServer.domain);
    urlObj.pathname = path.join(urlObj.pathname, requestedPath);
    reqURL = url.format(urlObj);
  } else {
    reqURL = requestedPath;
  }

  return fetch(reqURL, _.extend(defaultOpts(), opts))
}
