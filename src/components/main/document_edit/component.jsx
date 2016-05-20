"use strict";

/* eslint camelcase:0 */

var React = require('react')
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

    /* from Editable */
    loading: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,

    /* from StandaloneForm */
    document: React.PropTypes.instanceOf(Document).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    saveAndRedirect: React.PropTypes.func.isRequired,
    handleRecordChange: React.PropTypes.func.isRequired
  },

  render() {
    var DocumentForm = require('../../shared/document_form/component.jsx')
      , { loading, handleRecordChange, saveAndRedirect } = this.props

    return (
      <div>
        <DocumentForm
            {...this.props}
            onChange={handleRecordChange} />

        <section>
          <div className="well">
            <button
                className="btn btn-primary btn-large"
                disabled={loading}
                onClick={saveAndRedirect}>
              <Translate text={commonStrings.save} />
            </button>
          </div>
        </section>
      </div>
    )
  }
});

module.exports = connect(require('../default_api_mapper'))(standaloneForm(DocumentEdit, Document))
