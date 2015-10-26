"use strict";

var React = require('react')

module.exports = React.createClass({
  render: function () {
    var version = require('../../../../package.json').version
    return (
      <div className="bg-silver">
        <div className="py2 clearfix bg-lighten-4">
          <div className="container">
            <span className="right">Version {version}</span>
          </div>
        </div>
      </div>
    )
  }
});
