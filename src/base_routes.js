"use strict";

function getJSONFromPath(get, pathname) {
  return get(pathname, { 'Accept': 'application/json' })
    .then(data => JSON.parse(data))
    .then(data => ({ data }))
}

module.exports = {
  '/': {
    name: 'home',
    Component: require('./components/home.jsx'),
  },
  '/browse/': {
    name: 'browse',
    Component: require('./components/browse.jsx'),
    getData: getJSONFromPath
  },
  '/projects/:project_slug/notes/:id/': {
    name: 'notes_detail',
    Component: require('./components/notes_detail.jsx'),
    getData: getJSONFromPath
  },
  '/projects/:project_slug/documents/:id/': {
    name: 'documents_detail',
    Component: require('./components/documents_detail'),
    getData: getJSONFromPath
  },
  '/projects/:project_slug/topics/:id/': {
    name: 'topics_detail',
    Component: require('./components/topics_detail.jsx'),
    getData: getJSONFromPath
  },
  /*
  '/login/': {
    name: 'login',
    View: require('./login')
  },
  '/projects/': {
    name: 'projects_list',
    View: require('./projects_list'),
    fetch: true
  },
  '/projects/:project_slug/': {
    name: 'projects_detail',
    View: require('./projects_detail'),
    fetch: true
  },
  '/projects/:project_slug/documents/': {
    name: 'documents_list',
    View: require('./documents_list'),
    fetch: true
  },
  '/projects/:project_slug/documents/:document_id/transcript/': {
    name: 'transcripts_detail',
    View: require('./transcripts_detail'),
    fetch: true
  },
  '/projects/:project_slug/notes/': {
    name: 'notes_list',
    View: require('./notes_list'),
    fetch: true
  },
  '/projects/:project_slug/topics/': {
    name: 'topics_list',
    View: require('./topics_list'),
    fetch: true
  },
  */
}
