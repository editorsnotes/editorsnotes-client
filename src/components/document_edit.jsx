"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')
  , Document = require('../records/document')

module.exports = React.createClass({
  displayName: 'DocumentEdit',

  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map),
    project: React.PropTypes.instanceOf(Immutable.Map),
  },

  getInitialState() {
    return { document: new Document(this.props.data) }
  },

  renderBreadcrumb() {
    var Breadcrumb = require('./shared/breadcrumb.jsx')
      , document = this.props.data
      , project = this.props.project || document.get('project')
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') },
      { href: project.get('url') + 'documents/', label: 'Documents' },
    ]);

    crumbs = crumbs.concat(Immutable.fromJS(
      !this.props.data ?
        [ { label: 'Add' } ] :
        [
          { href: document.get('url'), label: document.get('description') },
          { label: 'Edit' }
        ]
    ))


    return <Breadcrumb crumbs={crumbs} />
  },

  isNew() {
    return !this.props.data
  },

  getProjectURL() {
    return this.isNew() ?
      this.props.project.get('url') :
      this.props.data.get('url').replace(/\/documents\/.*/, '/')
  },

  handleDocumentChange(document) {
    this.setState({ document });
  },

  handleSave() {
    var saveItem = require('../utils/save_item')
      , id = this.isNew() ? null : this.props.data.get('id')

    saveItem('document', id, this.getProjectURL(), this.state.document)
  },

  render() {
    var DocumentForm = require('./shared/document_form.jsx')
      , { document } = this.state

    return (
      <div>
        { this.renderBreadcrumb() }

        <DocumentForm
            document={document}
            projectURL={this.getProjectURL()}
            onChange={this.handleDocumentChange} />

        <section>
          <div className="well">
            <button
                className="btn btn-primary btn-large"
                onClick={this.handleSave}>
              Save
            </button>
          </div>
        </section>

      </div>
    )
  }
});
