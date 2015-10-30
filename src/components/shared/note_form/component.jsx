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
      <div className="bg-lightgray">
        <div className="container">
          <GeneralErrors
              errors={errors.delete('title').delete('markup')} />

          <header className="clearfix">
            <div className="col col-6">
              <div className="mb2">
                <FieldErrors errors={errors.get('title')} />
                <label>
                  <span className="h4 bold block">
                    Title
                  </span>
                  <input
                      name="title"
                      className="field col-10 h3"
                      maxLength="80"
                      type="text"
                      value={note.title}
                      onChange={this.handleChange} />
                </label>
              </div>

              <div className="mb2">
                <label>
                  <span className="h4 bold block">
                    Status
                  </span>
                  <select
                      className="col-3"
                      name="status"
                      value={note.status}
                      onChange={this.handleChange}>
                    <option value={"open"}>Open</option>
                    <option value={"closed"}>Closed</option>
                    <option value={"hibernating"}>Hibernating</option>
                  </select>
                </label>
              </div>

              <div className="mb2">
                <label>
                  <span className="h4 bold block">
                    Private
                  </span>
                  <select
                      className="col-3"
                      name="is_private"
                      value={note.is_private}
                      onChange={this.handleChange}>
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="col col-6">
              <span className="h4 bold block">Related topics</span>
              <RelatedTopicsSelector topics={note.get('related_topics').toSet()} />
            </div>
          </header>
        </div>

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
