"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')
  , standaloneForm = require('../../util/standalone_form.jsx')
  , editingBreadcrumb = require('../../util/editing_breadcrumb.jsx')
  , Note = require('../../../records/note')
  , NoteEdit

NoteEdit = React.createClass({
  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map),
    note: React.PropTypes.instanceOf(Note).isRequired,
    loading: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    renderBreadcrumb: React.PropTypes.func.isRequired,
    saveAndRedirect: React.PropTypes.func.isRequired,
    handleRecordChange: React.PropTypes.func.isRequired
  },

  getInitialState() {
    var { getEmbedded } = require('../../../helpers/api')
      , { data } = this.props
      , embeddedItems

    embeddedItems = data ?
      getEmbedded(data, 'references').toOrderedSet() :
      Immutable.OrderedSet()

    return { note: new Note(data), embeddedItems }
  },

  handleAddEmbeddedItem(item) {
    this.setState(prev => ({
      embeddedItems: prev.embeddedItems.add(item)
    }));
  },

  render() {
    var NoteForm = require('../../shared/note_form/component.jsx')
      , { note, loading, errors, projectURL, renderBreadcrumb, handleRecordChange, saveAndRedirect } = this.props
      , { embeddedItems } = this.state

    return (
      <div className="bg-lightgray absolute-full-height flex flex-column">

        <div className="px2 py1 flex-none" style={{ marginBottom: '-1rem' }}>
          { renderBreadcrumb() }
        </div>

        <div className="flex-grow flex flex-column">
          <NoteForm
              note={note}
              embeddedItems={embeddedItems}

              errors={errors}
              projectURL={projectURL}

              afterHeader={this.renderAfterHeader}

              onChange={handleRecordChange}
              onAddEmbeddedItem={this.handleAddEmbeddedItem}
              handleSave={saveAndRedirect} />
        </div>
      </div>
    )
  }
});

module.exports = editingBreadcrumb(standaloneForm(NoteEdit, Note), 'note');
