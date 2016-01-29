"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , EmbeddedItemsHandler = require('../../util/embedded_items_handler.jsx')
  , Note = require('../../../records/note')
  , NoteForm

NoteForm = React.createClass({
  propTypes: {
    note: React.PropTypes.instanceOf(Note).isRequired,
    embeddedItems: React.PropTypes.instanceOf(Immutable.Set).isRequired,

    projectURL: React.PropTypes.string.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,

    onChange: React.PropTypes.func.isRequired,
    onAddEmbeddedItem: React.PropTypes.func.isRequired,
    handleSave: React.PropTypes.func.isRequired,

    afterHeader: React.PropTypes.func,

    minimal: React.PropTypes.bool,
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

  handleTopicsChange(topics) {
    var { onAddEmbeddedItem } = this.props

    this.mergeValues({
      'related_topics': topics.map(topic => topic.get('url'))
    });

    topics.forEach(topic => onAddEmbeddedItem(topic));
  },

  mergeValues(value) {
    this.props.onChange(this.props.note.merge(value))
  },

  renderFields() {
    var RelatedTopicsSelector = require('../related_topic_selector/component.jsx')
      , FieldErrors = require('../field_errors.jsx')
      , { getEmbedded } = require('../../../helpers/api')
      , { note, projectURL, errors, embeddedItems } = this.props

    return (
      <div>
        <div>
          <div className="mb2">
            <FieldErrors errors={errors.get('title')} />
            <label>
              <span className="h4 bold block">Title</span>
              <input
                  name="title"
                  className="field col-12 h3"
                  maxLength="80"
                  type="text"
                  value={note.title}
                  onChange={this.handleChange} />
            </label>
          </div>
        </div>

        <div>
          <div className="mb2">
            <label>
              <span className="h4 bold block">Status</span>
              <select
                  style={{ width: '160px' }}
                  name="status"
                  value={note.status}
                  onChange={this.handleChange}>
                <option value={"open"}>Open</option>
                <option value={"closed"}>Closed</option>
                <option value={"hibernating"}>Hibernating</option>
              </select>
            </label>
          </div>
        </div>

        <div>
          <div className="mb2">
            <label>
              <span className="h4 bold block">Private</span>
              <select
                  style={{ width: '160px' }}
                  name="is_private"
                  value={note.is_private}
                  onChange={this.handleChange}>
                <option value={false}>Public</option>
                <option value={true}>Private</option>
              </select>
            </label>
          </div>
        </div>

        <div>
          <span className="h4 bold block">Related topics</span>
          <RelatedTopicsSelector
              topics={getEmbedded(Immutable.Map({
                topics: note.related_topics,
                embedded: embeddedItems.toMap().mapKeys((key, val) => val.get('url'))
              }), 'topics').toSet()}
              onChange={this.handleTopicsChange}
              projectURL={projectURL} />
        </div>

      </div>
    )
  },

  render() {
    var ENEditor = require('../en_editor/component.jsx')
      , TextEditor = require('../text_editor/component.jsx')
      , FieldErrors = require('../field_errors.jsx')
      , GeneralErrors = require('../general_errors.jsx')
      , { note, errors, minimal } = this.props
      , Editor = minimal ? TextEditor : ENEditor

    return (
      <div className="flex-grow flex flex-column">
        <div className="container col-12 flex-none">
          <GeneralErrors
              errors={errors.delete('title').delete('markup')} />
          { minimal && this.renderFields() }
        </div>

        <section className="flex-grow flex flex-column">
          <FieldErrors errors={errors.get('markup')} />
          <Editor
              ref="content"
              {...this.props}
              html={note.markup}
              onChange={markup => this.mergeValues({ markup })}
              defaultPane="metadata"
              additionalPanes={[
                {
                  key: 'metadata',
                  label: 'Metadata',
                  render: this.renderFields
                }
              ]} />
        </section>
      </div>
    )
  }
});

module.exports = EmbeddedItemsHandler(NoteForm);
