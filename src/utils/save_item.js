"use strict";

function onStart() {
  window.EditorsNotes.events.emit('loadstart');
}

function onStop(ret) {
  window.EditorsNotes.events.emit('loadstop');
  return ret;
}

function onError(error) {
  window.EditorsNotes.events.emit('loadstop');
  throw error;
}



module.exports = function (type, id, projectURL, data) {
  var cookie = require('cookie-cutter')
    , isNew = id === null
    , method = isNew ? 'post' : 'put'
    , url = `${projectURL}${type}s/`
    , opts

  if (!isNew) url += `${id}/`;

  opts = {
    method,
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json; charset=utf-8',
      'X-CSRFToken': cookie.get('csrftoken')
    },
    body: JSON.stringify(data)
  }

  onStart();

  return fetch(url, opts).then(onStop, onError)
}
