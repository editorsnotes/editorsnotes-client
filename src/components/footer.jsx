"use strict";

var React = require('react')

module.exports = React.createClass({
  render: function () {
    var version = require('../../package.json').version
    return (
      <div className="footer">
        <div className="footer-inner container">
        {version}
        </div>
      </div>
    )
  }
});
