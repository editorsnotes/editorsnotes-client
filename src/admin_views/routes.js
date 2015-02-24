module.exports = [
  {
    path: '/projects/:project/documents/add/',
    name: 'document_add',
    View: require('./document'),
    Model: require('../models/document')
  },
  {
    path: '/projects/:project/documents/:id/edit/',
    name: 'document_edit',
    View: require('./document'),
    Model: require('../models/document')
  },
  {
    path: '/projects/:project/notes/add/',
    name: 'note_add',
    View: require('./note'),
    Model: require('../models/note')
  },
  {
    path: '/projects/:project/notes/:id/edit/',
    name: 'note_edit',
    View: require('./note'),
    Model: require('../models/note')
  },
  {
    path: '/projects/:project/topics/add/',
    name: 'topic_add',
    View: require('./topic'),
    Model: require('../models/topic')
  },
  {
    path: '/projects/:project/topics/:id/edit/',
    name: 'topic_edit',
    View: require('./topic'),
    Model: require('../models/topic')
  }
]
