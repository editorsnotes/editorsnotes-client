"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'NoteSections',
  render: function () {
    return (
      <section id="note-sections">
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
            <div className="add-section ui-draggable" data-section-type="citation">
              <i className="section-drag-handle fa fa-ellipsis-v"></i>
              <i className="section-icon fa fa-file-text-o"></i> Citation
            </div>
            <div className="add-section ui-draggable" data-section-type="text">
              <i className="section-drag-handle fa fa-ellipsis-v"></i>
              Text
            </div>
            <div className="add-section ui-draggable" data-section-type="note_reference">
              <i className="section-drag-handle fa fa-ellipsis-v"></i>
              <i className="section-icon fa fa-pencil"></i> Note reference
            </div>
          </div>
        </div>
      </section>
    )
  }
});
