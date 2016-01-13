"use strict";

var React = require('react')
  , ReactDOM = require('react-dom')


module.exports = React.createClass({
  displayName: 'ENContentEditor',

  propTypes: {
  },

  getInitialState() {
    return {
      rightWidth: null,
      leftWidth: null,
      dragEl: null,
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

  handleDragEnd() {
    var { dragEl } = this.state

    dragEl.parentNode.removeChild(dragEl);

    this.setState({ dragEl: null });

    return false;
  },

  handleDrag(e) {
    var { pageX } = e
      , { offset } = this.state
      , leftWidth, rightWidth

    if (!offset) return;
    if (pageX === 0) return;

    leftWidth = pageX;

    if (leftWidth < 300) leftWidth = 300;
    rightWidth = offset - leftWidth - 16;

    this.setState({ leftWidth, rightWidth });
  },

  componentDidMount() {
    var leftEl = ReactDOM.findDOMNode(this.refs.left)
      , rightEl = ReactDOM.findDOMNode(this.refs.right)

    this.setState({
      leftWidth: leftEl.clientWidth,
      rightWidth: rightEl.clientWidth
    });
  },

  render() {
    var TextEditor = require('./text_editor.jsx')
      , Panes = require('./panes.jsx')
      , { leftWidth, rightWidth } = this.state
      , flex = leftWidth === rightWidth

    return (
      <div className="flex-grow bg-white flex flex-stretch">
        <div
            ref="left"
            className="relative"
            style={{
              width: flex ? 'auto' : leftWidth,
              flex: flex ? '2 2 0' : 'none'
            }}>
          <TextEditor width={leftWidth} />
        </div>

        <div
            className="relative"
            draggable="true"
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            onDrag={this.handleDrag}
            style={{ width: '16px', cursor: 'col-resize', marginLeft: -6 }}>
          <div className="absolute" style={{ width: '4px', background: '#ccc', height: '100%', left: '6px' }} />
        </div>


        <div
            ref="right"
            className="relative"
            style={{
              width: flex ? 'auto' : rightWidth,
              flex: flex ? '1 1 0' : 'none'
            }}>
          <Panes />
        </div>
      </div>
    )
  }
});
