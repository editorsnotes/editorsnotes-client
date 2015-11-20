"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , ZoteroFetching = require('./zotero_fetching.jsx')
  , ZoteroData

ZoteroData = React.createClass({
  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map),
    onValueChange: React.PropTypes.func.isRequired
  },

  handleSelectItemType(e) {
    var itemType = e.target.value
      , { fetchItemTemplates } = this.props

    if (!itemType) return;

    fetchItemTemplates(itemType);
  },

  handleFieldChange(field, e) {
    var { data, onValueChange } = this.props;
    onValueChange(data.set(field, e.target.value));
  },

  handleCreatorChange(index, value) {
    var { data, onValueChange } = this.props;

    onValueChange(data.setIn(['creators', index], value));
  },

  renderFields() {
    var { data } = this.props
      , ZoteroCreator = require('./zotero_creator_field.jsx')
      , ZoteroField = require('./zotero_field.jsx')
      , { creatorTypes } = this.props

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
              onChange={this.handleFieldChange.bind(null, field)} />
        )
      }

      return value.map((creator, i) => {
        return (
          <ZoteroCreator
              key={i}
              creator={creator}
              creatorTypes={creatorTypes}
              handleCreatorAdd={() => null}
              handleCreatorRemove={() => null}
              onCreatorChange={this.handleCreatorChange.bind(null, i)} />
        )
      })
    }).toList();
  },

  render() {
    var ItemTypeSelect = require('./item_type_select.jsx')
      , { data, itemTypes, loadingItemTypes, loadingItemTemplate } = this.props
      , currentType = data && data.get('itemType')

    return (
      <div>
        <ItemTypeSelect
            loading={loadingItemTypes}
            itemTypes={itemTypes}
            currentType={currentType}
            onChange={this.handleSelectItemType} />

        { data && this.renderFields() }
      </div>
    )
  }
});

module.exports = ZoteroFetching(ZoteroData);
