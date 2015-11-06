"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , url = require('url')
  , zoteroToCSL = require('zotero-to-csl')
  , Document = require('../../../records/document')


const ZOTERO_API_URL = 'https://api.zotero.org'


function fetchZoteroJSON(pathname, query={}) {
  var zoteroURL = ZOTERO_API_URL + url.format({ pathname, query })

  return fetch(zoteroURL, { headers: { Accept: 'application/json' }})
    .then(response => response.text())
    .then(text => {
      var keys = []
        , data

      data = Immutable.fromJS(JSON.parse(text, (k, v) => {
        if (!(/\d/.test(k))) keys.push(k);
        return v;
      }));

      return data instanceof Immutable.Map ?
        data.sortBy((v, k) => keys.indexOf(k)) :
        data
    })
}

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
      itemTypes: null,
      creatorTypes: null,
      citationGenerator: null
    }
  },

  componentDidMount() {
    var CitationGenerator = require('../../../utils/citation_generator')
      , { document } = this.props

    this.setState({ citationGenerator: new CitationGenerator() });

    fetchZoteroJSON('/itemTypes')
      .then(itemTypes => this.setState({ itemTypes }))

    if (document.hasIn(['zotero_data', 'itemType'])) {
      this.fetchItemTemplates(document.getIn(['zotero_data', 'itemType']));
    }
  },

  getDefaultProps() {
    return { minimal: false }
  },

  fetchItemTemplates(itemType) {
    return new Promise((resolve, reject) => {
      var itemTemplateP = fetchZoteroJSON('/items/new', { itemType })
        , creatorTypesP = fetchZoteroJSON('/itemTypeCreatorTypes', { itemType })

      Promise.all([itemTemplateP, creatorTypesP])
        .then(
          ([itemTemplate, creatorTypes]) => this.setState({
            itemTemplate, creatorTypes
          }, resolve),
          reject
        )
    })
  },

  handleSelectItemType(e) {
    var itemType = e.target.value

    if (!itemType) return;

    this.fetchItemTemplates(itemType)
      .then(() => this.props.onChange(
        this.props.document.set('zotero_data', this.state.itemTemplate)
      ))
  },

  handleZoteroFieldChange(field, e) {
    var { onChange } = this.props
      , updatedDocument

    if (!Array.isArray(field)) field = [field];

    updatedDocument = this.props.document
      .update('zotero_data', data => data.setIn(field, e.target.value))

    updatedDocument = updatedDocument
      .set('description', this.generateCitation(updatedDocument))

    onChange(updatedDocument);
  },

  handleZoteroCreatorChange(index, value) {
    this.handleZoteroFieldChange(index, { target: { value }});
  },

  generateCitation(document) {
    var { isEmptyItem } = require('../../../helpers/zotero_data')
      , { citationGenerator } = this.state
      , cslData

    if (isEmptyItem(document.zotero_data)) return jull;

    cslData = zoteroToCSL(document.zotero_data
      .delete('tags')
      .delete('collections')
      .delete('relations')
      .toJS())

    return citationGenerator.makeCitation(cslData);
  },

  renderZoteroData() {
    var data = this.props.document.zotero_data
      , ZoteroCreator = require('./zotero_creator_field.jsx')
      , ZoteroField = require('./zotero_field.jsx')
      , { creatorTypes } = this.state

    data = data
      .delete('itemType')
      .delete('tags')
      .delete('collections')
      .delete('relations')

    return data.map((value, field) => {
      if (field !== 'creators') {
        return (
          <ZoteroField
              key={field}
              field={field}
              value={value}
              onChange={this.handleZoteroFieldChange.bind(null, field)} />
        )
      }

      return value.map((creator, i) => {
        return (
          <ZoteroCreator
              key={i}
              creator={creator}
              creatorTypes={creatorTypes}
              onCreatorChange={this.handleZoteroCreatorChange.bind(null, ['creators', i])} />
        )
      })
    }).toList();
  },

  render() {
    var FieldErrors = require('../field_errors.jsx')
      , GeneralErrors = require('../general_errors.jsx')
      , ItemTypeSelect = require('./item_type_select.jsx')
      , { document, errors } = this.props
      , { itemTypes } = this.state
      , description = document.description || '<em>Fill in document metadata to generate citation.</em>'
      , currentType = document.getIn(['zotero_data', 'itemType']);

    return (
      <div>
        <GeneralErrors errors={errors.delete('description')} />

        <FieldErrors errors={errors.get('description')} />

        <p dangerouslySetInnerHTML={{ __html: description }} />

        {
          itemTypes && (
            <ItemTypeSelect
                itemTypes={itemTypes}
                currentType={currentType}
                onChange={this.handleSelectItemType} />
          )
        }

        { document.zotero_data && <hr /> }
        { document.zotero_data && this.renderZoteroData() }
      </div>
    )
  }
});
