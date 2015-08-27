"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'NoteEdit',

  getInitialState() {
    var Note = require('../../records/note');
    return { note: new Note(this.props.data) }
  },

  renderBreadcrumb: function () {
    var Breadcrumb = require('../shared/breadcrumb.jsx')
      , note = this.props.data
      , project = this.props.project || note.get('project')
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') },
      { href: project.get('url') + 'notes/', label: 'Notes' },
    ]);

    crumbs = crumbs.concat(Immutable.fromJS(
      !this.props.data ?
        [ { label: 'Add' } ] :
        [
          { href: note.get('url'), label: note.get('title') },
          { label: 'Edit' }
        ]
    ))


    return <Breadcrumb crumbs={crumbs} />
  },

  getValue: function () {
    return this.state.note
      .update('related_topics', topics => topics.map(topic => topic.get('url')))
      .update('license', license => license.get('url'))
  },

  handleValueChange(value) {
    this.setState(prev => ({ note: prev.note.merge(value) }));
  },

  handleChange: function (e) {
    var field = e.target.name
      , value = e.target.value

    if (field === 'is_private') {
      value = value === 'true' ? true : false;
    }

    this.setState(prev => ({ note: prev.note.set(field, value) }));
  },

  handleSave: function () {
    var cookie = require('cookie-cutter')
      , isNew = !this.props.data
      , method = isNew ? 'post' : 'put'
      , url = isNew ? (this.props.project.get('url') + 'notes/') : this.props.data.get('url')

    fetch(url, {
      method,
      credentials: 'same-origin',
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        'X-CSRFToken': cookie.get('csrftoken')
      },
      body: JSON.stringify(this.state.note)
    });
  },

  render: function () {
    var RelatedTopicsSelector = require('../shared/related_topic_selector.jsx')
      , HTMLEditor = require('../shared/text_editor/index.jsx')
      , note = this.state.note

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
              value={note.title}
              onChange={this.handleChange} />
        </header>

        <section id="note-details">
          <div id="note-about">
            <div id="note-status">
              <strong>This note is </strong>
              <select
                  name="status"
                  value={note.status}
                  onChange={this.handleChange}>
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
                  value={note.is_private}
                  onChange={this.handleChange}>
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </dd>
          </dl>
        </section>

        <section>
          <HTMLEditor
              ref="content"
              onChange={markup => this.handleValueChange({ markup })}
              html={note.markup} />
          <br />
        </section>

        <section>
          <div className="well">
            <button className="btn btn-primary btn-large" onClick={this.handleSave}>Save</button>
          </div>
        </section>

      </div>
    )
  }
});
