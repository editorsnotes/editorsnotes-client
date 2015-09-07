"use strict";

var React = require('react')
  , Document = require('../../records/document')

module.exports = React.createClass({
  displayName: 'DocumentForm',

  propTypes: {
    document: React.PropTypes.instanceOf(Document).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    minimal: React.PropTypes.bool
  },

  getDefaultProps() {
    return { minimal: false }
  },


  render() {
    return <div />
  }
});
