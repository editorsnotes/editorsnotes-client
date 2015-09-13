"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'Translate',

  propTypes: {
    text: React.PropTypes.string.isRequired,
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

    translated = jed
      .translate(text)
      .onDomain(domain)

    translated = number ?
      translated.fetch(number) :
      translated.fetch()

    return <span>{ translated }</span>
  }
});
