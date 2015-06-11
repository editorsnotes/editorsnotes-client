module.exports = [
  {
    path: '/projects/:project_slug/documents/add/',
    name: 'document_add',
    View: require('./document'),
    Model: require('../models/document'),
    fetch: 'model'
  },
  {
    path: '/projects/:project_slug/documents/:id/edit/',
    name: 'document_edit',
    View: require('./document'),
    Model: require('../models/document'),
    fetch: 'model'
  },
  {
    path: '/projects/:project_slug/notes/add/',
    name: 'note_add',
    View: require('./note'),
    Model: require('../models/note'),
    fetch: 'model'
  },
  {
    path: '/projects/:project_slug/notes/:id/edit/',
    name: 'note_edit',
    View: require('./note'),
    Model: require('../models/note'),
    fetch: 'model'
  },
  {
    path: '/projects/:project_slug/topics/add/',
    name: 'topic_add',
    View: require('./topic'),
    Model: require('../models/topic'),
    fetch: 'model'
  },
  {
    path: '/projects/:project_slug/topics/:id/edit/',
    name: 'topic_edit',
    View: require('./topic'),
    Model: require('../models/topic'),
    fetch: 'model'
  }
]
