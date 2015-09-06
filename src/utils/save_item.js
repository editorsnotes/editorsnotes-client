"use strict";

module.exports = function (type, id, projectURL, data) {
  var cookie = require('cookie-cutter')
    , isNew = id === null
    , method = isNew ? 'post' : 'put'
    , url = `${projectURL}/${type}s/`

  if (!isNew) url += `${id}/`;

  return fetch(url, {
    method,
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
      'X-CSRFToken': cookie.get('csrftoken')
    },
    body: JSON.stringify(data)
  });
}
