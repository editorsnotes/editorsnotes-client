"use strict";

const projectURL = pathname => pathname.replace(/(notes|topics|documents)\/add\//, '')

const trimmedURL = pathname => pathname.replace(/edit\/$/, '?embed_style=nested')

module.exports = {
  /* Notes */
  '/projects/:project_slug/notes/add/': {
    name: 'note_add',
    Component: require('./components/main/note_edit/component.jsx'),
    resource: projectURL,
    componentProps: () => ({
      noContainer: true,
      noFooter: true,
      noHeader: true
    })
  },

  '/projects/:project_slug/notes/:id/edit/': {
    name: 'note_edit',
    Component: require('./components/main/note_edit/component.jsx'),
    resource: trimmedURL,
    componentProps: () => ({
      noContainer: true,
      noFooter: true,
      noHeader: true
    })
  },

  /* Topics */
  '/projects/:project_slug/topics/add/': {
    name: 'topic_add',
    Component: require('./components/main/topic_edit/component.jsx'),
    resource: projectURL
  },
  '/projects/:project_slug/topics/:id/edit/': {
    name: 'topic_edit',
    Component: require('./components/main/topic_edit/component.jsx'),
    resource: trimmedURL
  },

  /* Documents */
  '/projects/:project_slug/documents/add/': {
    name: 'document_add',
    Component: require('./components/main/document_edit/component.jsx'),
    resource: projectURL
  },
  '/projects/:project_slug/documents/:id/edit/': {
    name: 'document_edit',
    Component: require('./components/main/document_edit/component.jsx'),
    resource: trimmedURL
  },

}
