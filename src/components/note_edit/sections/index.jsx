"use strict";

/* eslint camelcase:0 */

var _ = require('underscore')
  , React = require('react')
  , Immutable = require('immutable')
  , { DropTarget } = require('react-dnd')
  , NoteSectionEdit
  , sectionsTarget

const SECTION_COMPONENTS = {
  citation: require('./citation.jsx'),
  text: require('./text.jsx'),
  note_reference: require('./note_reference.jsx')
}

sectionsTarget = {
  hover(props, monitor, component) {
    var rect = React.findDOMNode(component).getBoundingClientRect()
      , avg = (rect.top + rect.bottom) / 2
      , hoveringHalf = monitor.getClientOffset().y < avg ? 'top' : 'bottom'

    component.setState({ hoveringHalf });
  },
  drop(props, monitor, component) {
    var section = Immutable.fromJS(monitor.getItem())
      , callback = component.state.hoveringHalf === 'top' ? 'onAddBefore' : 'onAddAfter'

    component.props[callback](section);
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}


NoteSectionEdit = React.createClass({
  displayName: 'NoteSectionEdit',
  getInitialState: function () {
    return { hovering: null }
  },
  getValue: function () {
    return this.refs.section.getValue();
  },
  isEmpty: function () {
    return this.refs.section.isEmpty();
  },
  render: function () {
    var { connectDropTarget, isOver, section } = this.props
      , { hoveringHalf } = this.state
      , SectionComponent = SECTION_COMPONENTS[section.get('section_type')]
      , placeholder = <div style={{ height: '40px', background: '#eee' }} />

    return connectDropTarget(
      <div>
        { isOver && hoveringHalf === 'top' && placeholder }
        <SectionComponent ref="section" section={section} />
        { isOver && hoveringHalf === 'bottom' && placeholder }
      </div>
    )
  }
});

module.exports = (
  DropTarget(
    _.values(require('../section_types')),
    sectionsTarget,
    collect
  )(NoteSectionEdit)
)
