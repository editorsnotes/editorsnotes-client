"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , standaloneForm = require('../../util/standalone_form.jsx')
  , editingBreadcrumb = require('../../util/editing_breadcrumb.jsx')
  , Note = require('../../../records/note')
  , NoteEdit


NoteEdit = React.createClass({
  propTypes: {
    /* from API response */
    data: React.PropTypes.instanceOf(Immutable.Map),

    /* from Editable */
    loading: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,

    /* from StandaloneForm */
    note: React.PropTypes.instanceOf(Note).isRequired,
    saveAndRedirect: React.PropTypes.func.isRequired,
    projectURL: React.PropTypes.string.isRequired,
    handleRecordChange: React.PropTypes.func.isRequired,

    /* from EditingBreadcrumb */
    renderBreadcrumb: React.PropTypes.func.isRequired
  },

  getInitialState() {
    var { getEmbedded } = require('../../../helpers/api')
      , { data } = this.props
      , embeddedItems

    embeddedItems = data ?
      getEmbedded(data, 'references').toOrderedSet() :
      Immutable.OrderedSet()

    return { embeddedItems }
  },

  handleAddEmbeddedItem(item) {
    this.setState(prev => ({
      embeddedItems: prev.embeddedItems.add(item)
    }));
  },

  render() {
    var NoteForm = require('../../shared/note_form/component.jsx')
      , { renderBreadcrumb, handleRecordChange, saveAndRedirect } = this.props

    return (
      <div className="bg-lightgray absolute-full-height flex flex-column">

        <div className="px3 py1 flex-none" style={{ marginBottom: '-1rem' }}>
          { renderBreadcrumb() }
        </div>

        <div className="flex-grow flex flex-column">
          <NoteForm
              {...this.props}
              {...this.state}
              onChange={handleRecordChange}
              onAddEmbeddedItem={this.handleAddEmbeddedItem}
              handleSave={saveAndRedirect} />
        </div>
      </div>
    )
  }
});

module.exports = editingBreadcrumb(standaloneForm(NoteEdit, Note), 'note');
