"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'Preformatted',

  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render() {
    var { data } = this.props

    return <pre>{ JSON.stringify(data, true, '  ') }</pre>
  }
});
