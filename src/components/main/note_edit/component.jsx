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

  /*
  renderAfterHeader() {
    var { saveAndRedirect } = this.props

    return (
      <div>
        <hr />
        <div className="p1 mb2 center">
          <button onClick={saveAndRedirect} className="btn btn-primary btn-large">Save</button>
        </div>
      </div>
    )
  },
  */

  render() {
    var NoteForm = require('../../shared/note_form/component.jsx')
      , { note, loading, errors, projectURL, renderBreadcrumb, handleRecordChange, saveAndRedirect } = this.props
      , { embeddedItems } = this.state

    return (
      <div className="bg-lightgray absolute flex flex-column" style={{
        left: 0,
        right: 0,
        height: '100%'
      }}>

        <div className="container mt2 col-12 flex-none">
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
