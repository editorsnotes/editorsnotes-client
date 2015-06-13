"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'TextSection',
  render: function () {
    var section = this.props.section

    return (
      <div className="note-section note-section-text">
        <div
            className="note-section-text-content"
            dangerouslySetInnerHTML={{ __html: section.get('content') }} />
      </div>
    )
  }
});
