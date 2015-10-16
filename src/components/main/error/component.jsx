"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'Error',
  render: function () {
    var error = this.props.data.get('__error__')

    return (
      <div>
        <h1>{ error.get('statusCode') } Error</h1>
      </div>
    )
  }
});
