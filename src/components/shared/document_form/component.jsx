"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , url = require('url')
  , zoteroToCSL = require('zotero-to-csl')
  , Document = require('../../../records/document')
  , Translate = require('../translate.jsx')


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

    this.setState({ citationGenerator: new CitationGenerator() });

    fetchZoteroJSON('/itemTypes')
      .then(itemTypes => this.setState({ itemTypes }))
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

  renderItemTypeSelect() {
    var { itemTypes } = this.state
      , { document } = this.props

    return (
      <div>
        <label>
          <strong>Item Type</strong>
          <br />
          <select
              value={document.zotero_data ? document.zotero_data.get('itemType') : ''}
              onChange={this.handleSelectItemType}>
            <option key='blank' value=''>Select an item type...</option>
            {
              itemTypes.map(type =>
                <option
                    key={type.get('itemType')}
                    value={type.get('itemType')}>
                  { type.get('localized') }
                </option>
              )
            }
          </select>
        </label>
      </div>
    )
  },

  handleZoteroChange(field, e) {
    var { isEmptyItem } = require('../../../helpers/zotero_data')
      , { citationGenerator } = this.state
      , updatedDocument
      , cslData
      , citation

    if (!Array.isArray(field)) field = [field];

    updatedDocument = this.props.document
      .update('zotero_data', data => data.setIn(field, e.target.value))

    if (!isEmptyItem(updatedDocument.zotero_data)) {
      cslData = zoteroToCSL(updatedDocument.zotero_data
        .delete('tags')
        .delete('collections')
        .delete('relations')
        .toJS())
      citation = citationGenerator.makeCitation(cslData);
      updatedDocument = updatedDocument.set('description', citation);
    }

    this.props.onChange(updatedDocument);
  },

  renderZoteroCreator(creator, i) {
    var { creatorTypes } = this.state

    return (
      <div className="zotero-row" key={`creator-${i}`}>
        <select
            value={creator.get('creatorType')}
            onChange={this.handleZoteroChange.bind(null, ['creators', i, 'creatorType'])}>
          {
            creatorTypes.map(type =>
              <option key={type.get('creatorType')} value={type.get('creatorType')}>
                <Translate text={type.get('creatorType')} domain='messages_zotero' />
              </option>
            )
          }
        </select>
        {
          creator.delete('creatorType').map((value, field) =>
            <input
                key={field}
                value={value}
                onChange={this.handleZoteroChange.bind(null, ['creators', i, field])} />
          ).toList()
        }
      </div>
    )
  },

  renderZoteroField(value, field) {
    if (field === 'creators') return value.map(this.renderZoteroCreator);

    return (
      <div key={field}>
        <label className="zotero-row">
          <Translate
              text={field}
              domain='messages_zotero' />
          <input
              value={value}
              onChange={this.handleZoteroChange.bind(null, field)} />
        </label>
      </div>
    )
  },

  renderZoteroData() {
    var data = this.props.document.zotero_data

    data = data
      .delete('itemType')
      .delete('tags')
      .delete('collections')
      .delete('relations')

    return data.map(this.renderZoteroField).toList();
  },

  render() {
    var FieldErrors = require('../field_errors.jsx')
      , GeneralErrors = require('../general_errors.jsx')
      , { document, errors } = this.props
      , { itemTypes } = this.state
      , description = document.description || '<em>Fill in document metadata to generate citation.</em>'

    return (
      <div>
        <GeneralErrors errors={errors.delete('description')} />

        <FieldErrors errors={errors.get('description')} />

        <p dangerouslySetInnerHTML={{ __html: description }} />
        { itemTypes && this.renderItemTypeSelect() }
        { document.zotero_data && <hr /> }
        { document.zotero_data && this.renderZoteroData() }
      </div>
    )
  }
});
