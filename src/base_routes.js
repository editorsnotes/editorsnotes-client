"use strict";

function getJSONFromPath(get, pathname) {
  return get(pathname, { 'Accept': 'application/json' })
    .then(data => JSON.parse(data))
    .then(data => ({ data }))
}

module.exports = {
  '/': {
    name: 'home',
    Component: require('./components/main/home/component.jsx'),
    getData: function (get) {
      return getJSONFromPath(get, '/notes/')
    }
  },
  '/browse/': {
    name: 'browse',
    Component: require('./components/main/browse/component.jsx'),
    getData: getJSONFromPath
  },
  '/projects/:project_slug/': {
    name: 'projects_detail',
    Component: require('./components/main/projects_detail/component.jsx'),
    getData: getJSONFromPath
  },

  '/projects/:project_slug/notes/': {
    name: 'notes_list',
    Component: require('./components/main/notes_list/component.jsx'),
    getData: getJSONFromPath
  },
  '/projects/:project_slug/notes/:id/': {
    name: 'notes_detail',
    Component: require('./components/main/notes_detail/component.jsx'),
    getData: getJSONFromPath
  },

  '/projects/:project_slug/documents/': {
    name: 'documents_list',
    Component: require('./components/main/documents_list/component.jsx'),
    getData: getJSONFromPath
  },
  '/projects/:project_slug/documents/:id/': {
    name: 'documents_detail',
    Component: require('./components/main/documents_detail/component.jsx'),
    getData: getJSONFromPath
  },

  '/projects/:project_slug/topics/': {
    name: 'topics_list',
    Component: require('./components/main/topics_list/component.jsx'),
    getData: getJSONFromPath
  },
  '/projects/:project_slug/topics/:id/': {
    name: 'topics_detail',
    Component: require('./components/main/topics_detail/component.jsx'),
    getData: getJSONFromPath
  },

  /*
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
  '/projects/:project_slug/documents/:document_id/transcript/': {
    name: 'transcripts_detail',
    View: require('./transcripts_detail'),
    fetch: true
  },
  */
}
