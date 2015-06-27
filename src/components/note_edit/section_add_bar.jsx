"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'NoteSectionAddBar',
  render: function () {
    var handles = require('./section_handles.jsx')

    return (
      <div id="section-add-bar-container">
        <div id="citation-edit-bar" style={{ overflow: "auto" }}>
          <h4>
            Add section
            {' '}
            <a title="Drag new sections to the area below in order to add to this note."
                data-toggle="tooltip"
                href="">
              <i className="fa fa-question-circle" />
            </a>
         </h4>

         <handles.CitationHandle />
         <handles.TextHandle />
         <handles.NoteReferenceHandle />

        </div>
      </div>
    )
  }
});
