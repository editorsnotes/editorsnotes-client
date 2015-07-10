"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'CitationSectionEdit',
  render: function () {
    var { section } = this.props

    return (
      <div className="note-section note-section-citation">
        <div className="citation-side">
          <i className="fa fa-file-text-o" />
        </div>

        <div className="citation-main">
          <div className="citation-document">
            <div dangerouslySetInnerHTML={{ __html: section.get('document_description') }} />
          </div>
          <div
              className="note-section-text-content"
              dangerouslySetInnerHTML={{ __html: section.get('content') }} />
        </div>
      </div>
    )
  }
});
