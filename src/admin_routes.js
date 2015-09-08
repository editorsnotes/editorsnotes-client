"use strict";

function getJSONFromTrimmedPath(get, pathname) {
  return get(pathname.replace(/edit\/$/, ''), { 'Accept': 'application/json' })
    .then(data => JSON.parse(data))
    .then(data => ({ data }))
}

function getProjectJSON(get, pathname) {
  return get(pathname.replace(/(notes|topics|documents)\/add\//, ''), { 'Accept': 'application/json' })
    .then(data => JSON.parse(data))
    .then(project => ({ project }))
}

module.exports = {
  /* Notes */
  '/projects/:project_slug/notes/add/': {
    name: 'note_add',
    Component: require('./components/note_edit/component.jsx'),
    getData: getProjectJSON
  },
  '/projects/:project_slug/notes/:id/edit/': {
    name: 'note_edit',
    Component: require('./components/note_edit/component.jsx'),
    getData: getJSONFromTrimmedPath
  },

  /* Topics */
  '/projects/:project_slug/topics/add/': {
    name: 'topic_add',
    Component: require('./components/topic_edit/component.jsx'),
    getData: getProjectJSON
  },
  '/projects/:project_slug/topics/:id/edit/': {
    name: 'topic_edit',
    Component: require('./components/topic_edit/component.jsx'),
    getData: getJSONFromTrimmedPath
  },

  /* Documents */
  '/projects/:project_slug/documents/add/': {
    name: 'document_add',
    Component: require('./components/document_edit/component.jsx'),
    getData: getProjectJSON
  },
  '/projects/:project_slug/documents/:id/edit/': {
    name: 'document_edit',
    Component: require('./components/document_edit/component.jsx'),
    getData: getJSONFromTrimmedPath
  },

}
