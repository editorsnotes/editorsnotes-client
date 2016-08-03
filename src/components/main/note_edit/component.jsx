"use strict";

const React = require('react')
    , Immutable = require('immutable')
    , standaloneForm = require('../../util/standalone_form.jsx')
    , EditingBreadcrumb = require('../../shared/editing_breadcrumb.jsx')
    , Note = require('../../../records/note')


const NoteEdit = React.createClass({
  propTypes: {
    /* from API response */
    data: React.PropTypes.instanceOf(Immutable.Map),

    /* from StandaloneForm */
    note: React.PropTypes.instanceOf(Note).isRequired,
    handleRecordChange: React.PropTypes.func.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map),
    saveButton: React.PropTypes.element.isRequired,
    project: React.PropTypes.instanceOf(Immutable.Map),
  },

  getInitialState() {
    const { getEmbedded } = require('../../../helpers/api')
        , { data } = this.props

    const embeddedItems = data
      ? getEmbedded(data, 'references').toOrderedSet()
      : Immutable.OrderedSet()

    return { embeddedItems }
  },

  handleAddEmbeddedItem(item) {
    this.setState(prev => ({
      embeddedItems: prev.embeddedItems.add(item)
    }));
  },

  render() {
    const NoteForm = require('../../shared/note_form/component.jsx')
        , { handleRecordChange } = this.props

    return (
      <div className="bg-lightgray absolute-full-height flex flex-column">

        <div className="px3 py1 flex-none" style={{ marginBottom: '-1rem' }}>
          <EditingBreadcrumb type="note" {...this.props} />
        </div>

        <div className="absolute" style={{
          top: 20,
          right: 28,
        }}>
          { this.props.saveButton }
        </div>

        <div className="flex-grow flex flex-column">
          <NoteForm
            {...this.props}
            {...this.state}
            onChange={handleRecordChange}
            onAddEmbeddedItem={this.handleAddEmbeddedItem}
          />
        </div>
      </div>
    )
  }
});

module.exports = standaloneForm(NoteEdit, Note)
