"use strict";

function getJSONFromTrimmedPath(get, pathname) {
  return get(pathname.replace(/edit\/$/, ''), { 'Accept': 'application/json' })
    .then(data => JSON.parse(data))
    .then(data => ({ data }))
}

module.exports = {
  '/projects/:project_slug/notes/:id/edit/': {
    name: 'note_edit',
    Component: require('./components/note_edit'),
    getData: getJSONFromTrimmedPath
  },
  /*
  '/projects/:project_slug/documents/add/': {
    name: 'document_add',
  },
  '/projects/:project_slug/documents/:id/edit/': {
    name: 'document_edit',
  },
  '/projects/:project_slug/notes/add/': {
    name: 'note_add',
  },
  '/projects/:project_slug/topics/add/': {
    name: 'topic_add',
  },
  '/projects/:project_slug/topics/:id/edit/': {
    name: 'topic_edit',
  }
  */
}
