"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'SectionsContainer',
  render: function () {
    var NoteSection = require('./sections')
      , { sections } = this.props

    return (
        <div style={{ minHeight: '200px' }}>

        {
          sections.map((section, i) =>
            <NoteSection
                key={section.has('note_section_id') ? section.hashCode() : Math.random().toString()}
                onAddBefore={this.props.onAddSection.bind(null, i)}
                onAddAfter={this.props.onAddSection.bind(null, i + 1)}
                section={section} />
          )
        }
        </div>
    )
  }
});
