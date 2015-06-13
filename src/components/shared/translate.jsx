"use strict";

var React = require('react')
  , Jed = require('jed')

module.exports = React.createClass({
  displayName: 'Translate',

  propTypes: {
    i18n: React.PropTypes.instanceOf(Jed).isRequired,
    text: React.PropTypes.string.isRequired,
    domain: React.PropTypes.string.isRequired
  },

  getDefaultProps: function () {
    return { domain: 'messages_main' }
  },

  render: function () {
    var text = this.props.i18n
      .translate(this.props.text)
      .onDomain(this.props.domain)
      .fetch()

    return <span>{text}</span>
  }
});
