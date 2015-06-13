"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'CitationSection',
  render: function () {
    var section = this.props.section
      , id = 'note-section-' + section.get('note_section_id')

    return (
      <div className="note-section note-section-citation" id={id}>

        <div className="citation-side">
          <a href={'#' + id}>
            <i className="fa fa-file-text-o"></i>
          </a>
        </div>

        <div className="citation-main">
          <div className="citation-document">
            <a href={section.get('document')}>
              <div dangerouslySetInnerHTML={{ __html: section.get('document_description') }} />
            </a>
          </div>

          {
            !section.get('content') ? '' :
              <div
                  className="note-section-text-content"
                  dangerouslySetInnerHTML={{ __html: section.get('content') }} />
          }

        </div>
      </div>
    )
  }
});
