"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'NoteReferenceSection',
  render: function () {
    return <h1>FIXME</h1>
      /*
      <div className="note-section note-reference-section">
        <div className="note-reference-note">
          <i className="fa fa-pencil"></i>
          <a href="{{ section.note_reference.get_absolute_url }}">{{ section.note_reference.as_html|safe }}</a>
        </div>
        {% if section.has_content %}
        <div className="note-section-content">
          {{ section.content|as_html }}
        </div>
        {% endif %}
      </div>
      */
  }
});
