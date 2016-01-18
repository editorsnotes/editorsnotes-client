"use strict";

var React = require('react')
  , ReactDOM = require('react-dom')


module.exports = React.createClass({
  displayName: 'ENContentEditor',

  propTypes: {
  },

  getInitialState() {
    return {
      dragEl: null,
      leftWidth: null,
      rightWidth: null,
      searchingReferenceType: null
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

  clearReferenceType() {
    var { editor } = this.refs.textEditor.state

    this.setState({ searchingReferenceType: null });
    editor.off('beforeChange', this.clearReferenceType);
  },

  handleAddEmptyReference(referenceType) {
    var { editor } = this.refs.textEditor.state

    this.setState({ searchingReferenceType: referenceType });
    editor.on('beforeChange', this.clearReferenceType);

    setTimeout(() => this.refs.topBar.refs.autocomplete.focus(), 10);
  },

  handleReferenceSelect(selectedItem) {
    var { getType } = require('../../../helpers/api')
      , { onAddEmbeddedItem } = this.props
      , { editor } = this.refs.textEditor.state

    editor.focus();

    if (!selectedItem) return;

    onAddEmbeddedItem(selectedItem);

    this.setState({ searchingReferenceType: null });

    setTimeout(() => {
      if (getType(selectedItem) === 'Document') {
        let end = editor.getCursor()
          , start = { line: end.line, ch: end.ch - 3 }

        if (start.ch > 0 && editor.getRange({ line: start.line, ch: start.ch - 1 }, start) === '[') {
          start.ch -= 1;
        }

        if (editor.getRange(end, { line: end.line, ch: end.ch + 1 }) === ']') {
          end.ch += 1;
        }

        if (editor.getLine(end.line) === '::: document @@d') {
          editor.setSelection({ line: end.line, ch: 16 });
          editor.replaceSelection(`${selectedItem.get('id')}\n\n\n\n:::`);
          editor.setSelection({ line: end.line + 2, ch: 0 });
        } else {
          editor.doc.setSelection(start, end);
          editor.doc.replaceSelection(`[@@d${selectedItem.get('id')}]`);
        }


      } else {
        editor.doc.replaceSelection(selectedItem.get('id') + ' ');
      }
    }, 0)
  },

  render() {
    var TextEditor = require('./text_editor.jsx')
      , Panes = require('./panes.jsx')
      , TopBar = require('./top_bar.jsx')
      , { projectURL } = this.props
      , { leftWidth, rightWidth, searchingReferenceType } = this.state
      , flex = leftWidth === rightWidth

    return (
      <div className="flex-grow flex flex-column">
        <div className="flex-none">
          <TopBar
              ref="topBar"
              itemType={searchingReferenceType}
              handleReferenceSelect={this.handleReferenceSelect}
              projectURL={projectURL} />
        </div>

        <div className="flex-grow bg-white flex flex-stretch">
          <div
              ref="left"
              className="relative"
              style={{
                width: flex ? 'auto' : leftWidth,
                flex: flex ? '3 3 0' : 'none'
              }}>
            <TextEditor
                ref="textEditor"
                onAddEmptyReference={this.handleAddEmptyReference}
                {...this.props} />
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
                flex: flex ? '2 2 0' : 'none'
              }}>
            <Panes {...this.props} />
          </div>
        </div>
      </div>
    )
  }
});
