"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , { DragSource } = require('react-dnd')
  , SectionTypes = require('./section_types')
  , sources
  , CitationHandle
  , TextHandle
  , NoteReferenceHandle


sources = {
  citation: {
    beginDrag: function () {
      return {
        section_type: 'citation',
        document: null,
        content: null
      }
    }
  },
  text: {
    beginDrag: function () {
      return {
        section_type: 'text',
        content: null
      }
    }
  },
  noteReference: {
    beginDrag: function () {
      return {
        section_type: 'note_reference',
        note: null,
        content: null
      }
    }
  }
}



function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

CitationHandle = React.createClass({
  propTypes: {
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired
  },

  render: function () {
    var { connectDragSource, isDragging } = this.props

    return connectDragSource(
      <div className="add-section" style={{ opacity: isDragging ? '0' : '1' }}>
        <i className="section-drag-handle fa fa-ellipsis-v" />
        <i className="section-icon fa fa-file-text-o" />
        {' '}
        Citation
      </div>
    )
  }
});

TextHandle = React.createClass({
  propTypes: {
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired
  },

  render: function () {
    var { connectDragSource, isDragging } = this.props

    return connectDragSource(
      <div className="add-section" style={{ opacity: isDragging ? '0' : '1' }}>
        <i className="section-drag-handle fa fa-ellipsis-v" />
        <i className="section-icon fa fa-pencil" />
        {' '}
        Text
      </div>
    )
  }
});

NoteReferenceHandle = React.createClass({
  propTypes: {
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired
  },

  render: function () {
    var { connectDragSource, isDragging } = this.props

    return connectDragSource(
      <div className="add-section" style={{ opacity: isDragging ? '0' : '1' }}>
        <i className="section-drag-handle fa fa-ellipsis-v" />
        {' '}
        Note reference
      </div>
    )
  }
});

module.exports = {
  CitationHandle: (
    DragSource(
      SectionTypes.CITATION,
      sources.citation,
      collect
    )(CitationHandle)
  ),
  TextHandle: (
    DragSource(
      SectionTypes.TEXT,
      sources.text,
      collect
    )(TextHandle)
  ),
  NoteReferenceHandle: (
    DragSource(
      SectionTypes.NOTE_REFERENCE,
      sources.noteReference,
      collect
    )(NoteReferenceHandle)
  )
}
