"use strict";

var _ = require('underscore')
  , Immutable = require('immutable')
  , React = require('react')
  , { DropTarget } = require('react-dnd')
  , sectionsTarget
  , SectionsContainer

sectionsTarget = {
  drop(props, monitor) {
    var section = Immutable.fromJS(monitor.getItem())
      , index = 0

    props.onAddSection(section, index);
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

SectionsContainer = React.createClass({
  render: function () {
    var { connectDropTarget, isOver } = this.props

    return connectDropTarget(
        <div style={{
          minHeight: '200px',
          background: isOver ? '#eee' : 'none'
        }}>
        </div>
    )
  }
});

module.exports = (
  DropTarget(
    _.values(require('./section_types')),
    sectionsTarget,
    collect
  )(SectionsContainer)
)
