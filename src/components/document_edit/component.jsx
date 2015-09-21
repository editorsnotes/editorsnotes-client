"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../shared/translate.jsx')
  , Document = require('../../records/document')
  , commonStrings = require('../common_strings')
  , standaloneForm = require('../shared/standalone_form.jsx')
  , DocumentEdit

DocumentEdit = React.createClass({
  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map),
    loading: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    saveAndRedirect: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { document: new Document(this.props.data) }
  },

  handleDocumentChange(document) {
    this.setState({ document });
  },

  handleSave() {
    var { saveAndRedirect } = this.props
      , { document } = this.state

    saveAndRedirect(document);
  },

  render() {
    var DocumentForm = require('../shared/document_form/component.jsx')
      , { loading, errors, projectURL } = this.props
      , { document } = this.state

    return (
      <div>
        <DocumentForm
            document={document}
            errors={errors}
            projectURL={projectURL}
            onChange={this.handleDocumentChange} />

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

module.exports = standaloneForm(DocumentEdit, 'document');
