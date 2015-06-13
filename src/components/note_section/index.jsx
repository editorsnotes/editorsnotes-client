"use strict";

var React = require('react')

const SECTION_TYPES = {
  text: require('./text.jsx'),
  citation: require('./citation.jsx'),
  note_reference: require('./note_reference.jsx')
}


module.exports = React.createClass({
  displayName: 'NoteSection',
  render: function () {
    var type = this.props.section.get('section_type')
      , SectionComponent = SECTION_TYPES[type]

    return <SectionComponent section={this.props.section} />
  }
});
