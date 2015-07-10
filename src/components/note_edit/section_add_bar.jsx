"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'NoteSectionAddBar',
  getInitialState: function () {
    return { sticky: false }
  },
  componentDidMount: function () {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  },
  componentDidUnmount: function () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  handleScroll: function () {
    var el = React.findDOMNode(this)
      , offsetTop = el.getBoundingClientRect().top

    if (offsetTop < 0) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
    }

  },
  render: function () {
    var handles = require('./section_handles.jsx')

    return (
      <div id="section-add-bar-container">
        <div id="citation-edit-bar"
            className={this.state.sticky ? 'sticky' : ''}
            style={{ overflow: "auto" }} >
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
