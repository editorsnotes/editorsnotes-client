"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'ItemTypeSelect',

  propTypes: {
    itemTypes: React.PropTypes.instanceOf(Immutable.List),
    currentType: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  },

  render() {
    var { onChange, itemTypes, currentType, loading } = this.props

    return (
      <label className="ZoteroField flex flex-center mb1">
        <strong>Item type</strong>
        {
          (loading || !itemTypes) ?
            <select disabled={true}><option>Loading...</option></select> :
            <select value={currentType || ''} onChange={onChange}>
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
        }
      </label>
    )
  }

});
