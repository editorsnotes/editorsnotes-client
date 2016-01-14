"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'Panes',

  propTypes: {
  },

  render() {
    var Help = require('./help.jsx')

    return (
      <div className="absolute p2 border-box" style={{
        overflowY: 'scroll',
        left: 0,
        right: 0,
        height: '100%'
      }}>
        <Help />
      </div>
    )
  }
});
