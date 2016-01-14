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
      <div className="absolute-full-height p2 border-box" style={{ overflowY: 'scroll', }}>
        <Help />
      </div>
    )
  }
});
