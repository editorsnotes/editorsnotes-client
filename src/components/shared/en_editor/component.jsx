"use strict";

var React = require('react')
  , classnames = require('classnames')


module.exports = React.createClass({
  displayName: 'ENContentEditor',

  propTypes: {
  },

  getInitialState() {
    return {
      x: null,
      dragEl: null,
      offset: null
    }
  },

  handleDragStart(e) {
    var dragEl = document.createElement('span')

    document.body.appendChild(dragEl);
    e.dataTransfer.setDragImage(dragEl, 0, 0);

    this.setState({
      dragEl,
      offset: document.body.clientWidth
    });

    return true;
  },

  handleDragEnd(e) {
    var { dragEl } = this.state

    dragEl.parentNode.removeChild(dragEl);

    this.setState({
      offset: null,
      dragEl: null
    });

    return false;
  },

  handleDrag(e) {
    var { pageX } = e
      , { offset } = this.state

    if (!offset) return;
    if (pageX === 0) return;

    this.setState({ x: offset - pageX });
  },

  render() {
    var TextEditor = require('./text_editor.jsx')
      , Panes = require('./panes.jsx')
      , { x } = this.state

    return (
      <div className="flex-grow flex flex-stretch bg-white">
        <div className="flex-grow" ref="left-pane">
          <TextEditor />
        </div>

        <div
            className="relative"
            draggable="true"
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            onDrag={this.handleDrag}
            style={{
              width: '16px',
              cursor: 'col-resize'
            }}>
          <div className="absolute" style={{ width: '4px', background: '#ccc', height: '100%', left: '6px' }} />
        </div>


        <div className={classnames({"flex-grow": x === null})} style={{
          width: x === null ? 'auto' : x
        }}>
          <Panes />
        </div>
      </div>
    )
  }
});
