"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , zoteroToCSL = require('zotero-to-csl')
  , Document = require('../../../records/document')


module.exports = React.createClass({
  displayName: 'DocumentForm',

  propTypes: {
    document: React.PropTypes.instanceOf(Document).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    minimal: React.PropTypes.bool
  },

  getInitialState() {
    return {
      citationGenerator: null
    }
  },

  componentDidMount() {
    var CitationGenerator = require('../../../utils/citation_generator');
    this.setState({ citationGenerator: new CitationGenerator() });
  },

  getDefaultProps() {
    return { minimal: false }
  },

  handleZoteroValueChange(data) {
    var { onChange, document } = this.props
      , updatedDocument = document.set('zotero_data', data)

    updatedDocument = updatedDocument
      .set('description', this.generateCitation(updatedDocument))

    onChange(updatedDocument);
  },

  generateCitation(document) {
    var { isEmptyItem } = require('../../../helpers/zotero_data')
      , { citationGenerator } = this.state
      , cslData

    if (isEmptyItem(document.zotero_data)) return null;

    cslData = zoteroToCSL(document.zotero_data
      .delete('tags')
      .delete('collections')
      .delete('relations')
      .toJS())

    return citationGenerator.makeCitation(cslData);
  },

  render() {
    var FieldErrors = require('../field_errors.jsx')
      , GeneralErrors = require('../general_errors.jsx')
      , ZoteroData = require('./zotero_data.jsx')
      , { document, errors, minimal } = this.props
      , description = document.description || '<em>Fill in document metadata to generate citation.</em>'

    return (
      <div className="clearfix">
        <div className={ minimal ? '' : 'md-col md-col-right md-col-6 col-right'}>
          <GeneralErrors errors={errors.delete('description')} />
          <FieldErrors errors={errors.get('description')} />
          <p dangerouslySetInnerHTML={{ __html: description }} />
        </div>

        <div className={ minimal ? '' : 'md-col md-col-right md-col-6 col-right px2'}>
          <ZoteroData
              data={document.zotero_data}
              onValueChange={this.handleZoteroValueChange} />
        </div>
      </div>
    )
  }
});
