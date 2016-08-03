"use strict";

const React = require('react')
    , Immutable = require('immutable')
    , Translate = require('../../shared/translate.jsx')
    , Document = require('../../../records/document')
    , commonStrings = require('../../common_strings')
    , standaloneForm = require('../../util/standalone_form.jsx')
    , { connect } = require('react-redux')

const DocumentEdit = React.createClass({
  propTypes: {
    /* from API response */
    data: React.PropTypes.instanceOf(Immutable.Map),


    /* from StandaloneForm */
    document: React.PropTypes.instanceOf(Document).isRequired,
    handleRecordChange: React.PropTypes.func.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map),
    saveButton: React.PropTypes.element.isRequired,
    project: React.PropTypes.instanceOf(Immutable.Map),
  },

  render() {
    const DocumentForm = require('../../shared/document_form/component.jsx')
        , { handleRecordChange, saveButton } = this.props

    return (
      <div>
        <DocumentForm
            {...this.props}
            onChange={handleRecordChange} />

        <section>
          <div className="well">
            { saveButton }
          </div>
        </section>
      </div>
    )
  }
});

module.exports = connect(require('../default_api_mapper'))(standaloneForm(DocumentEdit, Document))
