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
    var { onChange, itemTypes, currentType } = this.props

    return (
      <div>
        <label>
          <strong>Item Type</strong>

          <br />

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
        </label>
      </div>
    )
  }

});
