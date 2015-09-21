"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../shared/translate.jsx')
  , standaloneForm = require('../shared/standalone_form.jsx')
  , commonStrings = require('../common_strings')
  , Note = require('../../records/note')
  , NoteEdit

NoteEdit = React.createClass({
  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map),
    loading: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    saveAndRedirect: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { note: new Note(this.props.data) }
  },

  handleNoteChange(note) {
    this.setState({ note });
  },

  handleSave() {
    var { saveAndRedirect } = this.props
      , { note } = this.state

    saveAndRedirect(note);
  },

  render() {
    var NoteForm = require('../shared/note_form/component.jsx')
      , { loading, errors, projectURL } = this.props
      , { note } = this.state

    return (
      <div>
        <NoteForm
            note={note}
            errors={errors}
            projectURL={projectURL}
            onChange={this.handleNoteChange} />

        <section>
          <div className="well">
            <button
                className="btn btn-primary btn-large"
                disabled={loading}
                onClick={this.handleSave}>
              <Translate text={commonStrings.save} />
            </button>
          </div>
        </section>
      </div>
    )
  }
});

module.exports = standaloneForm(NoteEdit, 'note')
