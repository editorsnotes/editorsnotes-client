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
  var apiFetch = require('./api_fetch')
    , isNew = id === null
    , method = isNew ? 'post' : 'put'
    , url = `${projectURL}${type}s/`

  if (!isNew) url += `${id}/`;

  onStart();

  return (
    apiFetch(url, { method, body: JSON.stringify(data) })
      .then(onStop, onError)
  )
}
