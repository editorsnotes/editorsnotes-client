"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'NoteEdit',

  renderBreadcrumb: function () {
    var Breadcrumb = require('../shared/breadcrumb.jsx')
      , note = this.props.data
      , project = note.get('project')
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') },
      { href: project.get('url') + 'notes/', label: 'Notes' },
      { href: note.get('url'), label: note.get('title') },
      { label: 'Edit' }
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render: function () {
    var RelatedTopicsSelector = require('../shared/related_topic_selector.jsx')
      , HTMLEditor = require('../shared/text_editor.jsx')
      , note = this.props.data

    return (
      <div>
        {this.renderBreadcrumb()}
        <header>
          <h3>Title</h3>
          <div data-error-target="title"></div>
          <input
              id="note-title"
              name="title"
              maxLength="80"
              type="text"
              value={note.get('title')} />
        </header>

        <section id="note-details">
          <div id="note-about">
            <div id="note-status">
              <strong>This note is </strong>
              <select
                  name="status"
                  value={note.get('status')}>
                <option value={"open"}>Open</option>
                <option value={"closed"}>Closed</option>
                <option value={"hibernating"}>Hibernating</option>
              </select>
            </div>
            <div id="note-related-topics">
              <span>Related topics</span>
              <RelatedTopicsSelector topics={note.get('related_topics').toSet()} />
            </div>
          </div>

          <dl id="note-authorship">
            <dt>Private</dt>
            <dd>
              <select
                  name="is_private"
                  id="note-private"
                  value={note.get('is_private')}>
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </dd>
          </dl>
        </section>

        <section id="note-description">
          <HTMLEditor
              style={{
                height: '200px',
                width: '99%',
                padding: '4px 6px',
                border: '1px solid rgb(204, 204, 204)',
                'border-radius': '4px'
              }}
              html={note.get('content')} />
        </section>

      </div>
    )
  }
});
