"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../translate.jsx')

module.exports = React.createClass({
  displayName: 'ZoteroField',

  propTypes: {
    field: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  render() {
    var { field, value, onChange } = this.props

    return (
      <label className="ZoteroField mb1 flex flex-center">
        <Translate
            text={field}
            domain='messages_zotero' />
        <input
            type="text"
            className="field flex-grow"
            value={value}
            onChange={onChange} />
      </label>
    )
  }
});
