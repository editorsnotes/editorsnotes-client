"use strict";

const React = require('react')
    , Jed = require('jed')
    , { connect } = require('react-redux')

function mapStateToProps(state) {
  return {
    jed: state.get('jed')
  }
}

const Translate = React.createClass({
  propTypes: {
    jed: React.PropTypes.instanceOf(Jed),
    text: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.array
      ]).isRequired,
    number: React.PropTypes.number,
    domain: React.PropTypes.string
  },

  render() {
    const { jed, number, domain='messages_main' } = this.props

    let { text } = this.props

    if (Array.isArray(text)) {
      text = text[0];
    }

    const translated = jed
      .translate(text)
      .onDomain(domain)

    return <span>{ number ?
      translated.fetch(number) :
      translated.fetch() }</span>
  }
})

module.exports = connect(mapStateToProps)(Translate)
