"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Note = require('../../../records/note')

module.exports = React.createClass({
  displayName: 'NoteForm',

  propTypes: {
    note: React.PropTypes.instanceOf(Note).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    minimal: React.PropTypes.bool
  },

  getDefaultProps() {
    return { minimal: false }
  },

  handleChange(e) {
    var { name, value } = e.target
      , updatedNote

    if (name === 'is_private') {
      value = value === 'true' ? true : false;
    }

    updatedNote = this.props.note.set(name, value);
    this.props.onChange(updatedNote);
  },

  mergeValues(value) {
    this.props.onChange(this.props.note.merge(value))
  },

  render() {
    var RelatedTopicsSelector = require('../related_topic_selector/component.jsx')
      , HTMLEditor = require('../text_editor/component.jsx')
      , FieldErrors = require('../field_errors.jsx')
      , GeneralErrors = require('../general_errors.jsx')
      , { note, projectURL, minimal, errors } = this.props

    return (
      <div>

        <GeneralErrors
            errors={errors.delete('title').delete('markup')} />

        <header>
          <h3>Title</h3>
          <FieldErrors errors={errors.get('title')} />
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
          <FieldErrors errors={errors.get('markup')} />
          <HTMLEditor
              ref="content"
              onChange={markup => this.mergeValues({ markup })}
              projectURL={projectURL}
              minimal={minimal}
              html={note.markup} />
          <br />
        </section>
      </div>
    )
  }
});
