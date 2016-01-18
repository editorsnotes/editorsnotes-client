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

  render() {
    var RelatedTopicsSelector = require('../related_topic_selector/component.jsx')
      , HTMLEditor = require('../en_editor/component.jsx')
      , FieldErrors = require('../field_errors.jsx')
      , GeneralErrors = require('../general_errors.jsx')
      , { getEmbedded } = require('../../../helpers/api')
      , { note, projectURL, errors, embeddedItems, handleSave } = this.props

    return (
      <div className="flex-grow flex flex-column">
        <div className="container col-12 flex-none">
          <GeneralErrors
              errors={errors.delete('title').delete('markup')} />

          <header className="clearfix">
            <div className="col col-6">
              <div className="mb2">
                <FieldErrors errors={errors.get('title')} />
                <label>
                  <input
                      name="title"
                      className="field col-10 h3"
                      placeholder="Title"
                      maxLength="80"
                      type="text"
                      value={note.title}
                      onChange={this.handleChange} />
                </label>
              </div>
            </div>

            <div className="col col-3 px2">
              <div className="mb2">
                <label>
                  <select
                      className="col-12"
                      name="status"
                      value={note.status}
                      onChange={this.handleChange}>
                    <option value={"open"}>Status: Open</option>
                    <option value={"closed"}>Status: Closed</option>
                    <option value={"hibernating"}>Status: Hibernating</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="col col-3 px2">
              <div className="mb2">
                <label>
                  <select
                      className="col-12"
                      name="is_private"
                      value={note.is_private}
                      onChange={this.handleChange}>
                    <option value={false}>Public</option>
                    <option value={true}>Private</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="col col-12">
              <RelatedTopicsSelector
                  topics={getEmbedded(Immutable.Map({
                    topics: note.related_topics,
                    embedded: embeddedItems.toMap().mapKeys((key, val) => val.get('url'))
                  }), 'topics').toSet()}
                  onChange={this.handleTopicsChange}
                  projectURL={projectURL} />
            </div>

          </header>
        </div>

        <section className="flex-grow flex flex-column">
          <FieldErrors errors={errors.get('markup')} />
          <HTMLEditor
              ref="content"
              {...this.props}
              html={note.markup}
              onChange={markup => this.mergeValues({ markup })} />
        </section>
      </div>
    )
  }
});

module.exports = EmbeddedItemsHandler(NoteForm);
