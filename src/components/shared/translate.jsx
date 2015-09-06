"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'Translate',

  propTypes: {
    text: React.PropTypes.string.isRequired,
    domain: React.PropTypes.string.isRequired
  },

  getDefaultProps: function () {
    return { domain: 'messages_main' }
  },

  render: function () {
    var { jed } = global.EditorsNotes
      , text

    text = jed
      .translate(this.props.text)
      .onDomain(this.props.domain)
      .fetch()

    return <span>{text}</span>
  }
});
