"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'Translate',

  propTypes: {
    text: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.array
      ]).isRequired,
    number: React.PropTypes.number,
    domain: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      domain: 'messages_main'
    }
  },

  render: function () {
    var { jed } = global.EditorsNotes
      , { text, number, domain } = this.props
      , translated

    if (Array.isArray(text)) {
      text = text[0];
    }

    translated = jed
      .translate(text)
      .onDomain(domain)

    translated = number ?
      translated.fetch(number) :
      translated.fetch()

    return <span>{ translated }</span>
  }
});
