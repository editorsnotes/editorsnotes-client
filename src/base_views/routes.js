module.exports = [
  {
    path: '/',
    name: 'home',
    View: require('./home'),
  },
  {
    path: '/login/',
    name: 'login',
    View: require('./login')
  },
  {
    path: '/projects/',
    name: 'projects_list',
    View: require('./projects_list'),
    fetch: true
  },
  {
    path: '/projects/:project_slug/',
    name: 'projects_detail',
    View: require('./projects_detail'),
  },
  {
    path: '/browse/',
    name: 'browse',
    View: require('./browse'),
    fetch: true
  },
  {
    path: '/projects/:project_slug/documents/',
    name: 'documents_list',
    View: require('./documents_list'),
  },
  {
    path: '/projects/:project_slug/documents/:id/',
    name: 'documents_detail',
    View: require('./documents_detail'),
    fetch: true
  },
  {
    path: '/projects/:project_slug/documents/:document_id/transcript/',
    name: 'transcripts_detail',
    View: require('./transcripts_detail'),
  },
  {
    path: '/projects/:project_slug/notes/',
    name: 'notes_list',
    View: require('./notes_list'),
    fetch: true
  },
  {
    path: '/projects/:project_slug/notes/:id/',
    name: 'notes_detail',
    View: require('./notes_detail'),
    Model: require('../models/note')
  },
  {
    path: '/projects/:project_slug/topics/',
    name: 'topics_list',
    View: require('./topics_list'),
  },
  {
    path: '/projects/:project_slug/topics/:id/',
    name: 'topics_detail',
    View: require('./topics_detail'),
    fetch: true
  }
]
