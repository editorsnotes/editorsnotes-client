"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'NoteSections',
  handleAddSection(section, index) {
    console.log(section.toJS(), index);
  },
  render: function () {
    var SectionAddBar = require('./section_add_bar.jsx')
      , SectionsContainer = require('./sections_container.jsx')

    return (
      <section id="note-sections">
        <SectionAddBar />
        <SectionsContainer onAddSection={this.handleAddSection} />
      </section>
    )
  }
});

