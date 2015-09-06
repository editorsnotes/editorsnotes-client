"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')
  , Note = require('../records/note')

module.exports = React.createClass({
  displayName: 'NoteEdit',

  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map),
    project: React.PropTypes.instanceOf(Immutable.Map),
  },

  getInitialState() {
    return { note: new Note(this.props.data) }
  },

  renderBreadcrumb() {
    var Breadcrumb = require('./shared/breadcrumb.jsx')
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

  isNew() {
    return !this.props.data
  },

  getProjectURL() {
    return this.isNew() ?
      this.props.project.get('url') :
      this.props.data.get('url').replace('notes/', '')
  },

  handleNoteChange(note) {
    this.setState({ note });
  },

  handleSave() {
    var cookie = require('cookie-cutter')
      , method = this.isNew() ? 'post' : 'put'
      , url = this.getProjectURL() + 'notes/'

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

  render() {
    var NoteForm = require('./shared/note_form.jsx')

    return (
      <div>
        { this.renderBreadcrumb() }

        <NoteForm
            note={this.state.note}
            projectURL={this.getProjectURL()}
            onChange={this.handleNoteChange} />

        <section>
          <div className="well">
            <button
                className="btn btn-primary btn-large"
                onClick={this.handleSave}>
              Save
            </button>
          </div>
        </section>

      </div>
    )
  }
});
