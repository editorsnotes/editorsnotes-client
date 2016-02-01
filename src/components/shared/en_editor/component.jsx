"use strict";

var React = require('react')
  , ReactDOM = require('react-dom')
  , classnames = require('classnames')


module.exports = React.createClass({
  displayName: 'ENContentEditor',

  propTypes: {
    onAddEmbeddedItem: React.PropTypes.func,
    projectURL: React.PropTypes.string.isRequired,
    defaultPane: React.PropTypes.string,
    additionalPanes: React.PropTypes.array
  },

  getInitialState() {
    return {
      dragEl: null,
      rightWidth: null,

      newItemType: null,
      newItemInitialText: null,

      selectingReferenceType: null,
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
      , rightWidth
      , leftWidth

    if (!offset) return;
    if (pageX === 0) return;

    leftWidth = pageX;

    if (leftWidth < 300) leftWidth = 300;
    rightWidth = offset - leftWidth - 16;

    this.setState({ rightWidth });
  },

  componentDidMount() {
    var rightEl = ReactDOM.findDOMNode(this.refs.right)

    this.setState({
      rightWidth: rightEl.clientWidth
    });
  },

  clearReferenceType() {
    var { editor } = this.refs.textEditor.state

    this.setState({ selectingReferenceType: null });
    editor.off('beforeChange', this.clearReferenceType);
  },

  handleAddEmptyReference(referenceType) {
    var { editor } = this.refs.textEditor.state

    this.setState({ selectingReferenceType: referenceType });
    editor.on('beforeChange', this.clearReferenceType);

    setTimeout(() => this.refs.topBar.refs.autocomplete.focus(), 10);
  },

  handleReferenceAdd(selectedItem, itemType) {
    var { getType } = require('../../../helpers/api')
      , { editor } = this.refs.textEditor.state
      , text

    if (!selectedItem) return;

    text = `@@${getType(selectedItem).slice(0, 1).toLowerCase()}`;

    if (itemType === 'citation-block') {
      text = '::: document ' + text;
    }

    editor.replaceSelection(text);
    this.handleReferenceSelect(selectedItem);
  },

  handleReferenceSelect(selectedItem) {
    var { getType } = require('../../../helpers/api')
      , { onAddEmbeddedItem } = this.props
      , { editor } = this.refs.textEditor.state

    editor.focus();

    if (!selectedItem) return;

    onAddEmbeddedItem(selectedItem);

    this.setState({ selectingReferenceType: null });

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

  handleClickAddItem(newItemType, newItemInitialText) {
    this.setState({
      newItemType,
      newItemInitialText,
      selectingReferenceType: null
    })
  },

  render() {
    var TextEditor = require('../text_editor/component.jsx')
      , Panes = require('./panes.jsx')
      , TopBar = require('./top_bar.jsx')
      , AddInlineItem = require('../add_inline_item.jsx')
      , { projectURL } = this.props
      , { rightWidth, selectingReferenceType, newItemType, newItemInitialText } = this.state
      , initial = rightWidth === null

    return (
      <div className="flex-grow flex flex-column">
        <div className="flex-none">
          <TopBar
              ref="topBar"
              {...this.state}
              projectURL={projectURL}
              handleReferenceSelect={this.handleReferenceSelect}
              handleReferenceAdd={this.handleReferenceAdd}
              handleClickAddItem={this.handleClickAddItem} />
        </div>

        <div className="flex-grow bg-white flex flex-stretch">
          <div
              ref="left"
              className="relative"
              style={{ flex: initial ? '3 3 0' : '1 0 auto' }}>
            <TextEditor
                ref="textEditor"
                onAddEmptyReference={this.handleAddEmptyReference}
                {...this.props} />
          </div>

          <div
              className="relative flex-none"
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
                width: initial ? 'auto' : rightWidth,
                flex: initial ? '2 2 0' : 'none'
              }}>
            <Panes {...this.props} />
          </div>
        </div>

        {
          newItemType && (
            <div className="absolute bg-grey flex flex-justify-center" style={{
              top: 84,
              left: 0,
              right: 0,
              height: 'calc(100vh - 84px)',
              background: 'rgba(128,128,128,.5)',
              zIndex: 10
            }}>
              <div className="bg-white p3" style={{ width: 500 }}>
                <AddInlineItem
                    autofocus={true}
                    type={newItemType}
                    onSelect={this.handleSelect}
                    onCancel={() => this.setState({
                      newItemType: null,
                      newItemInitialText: null
                    })}
                    projectURL={projectURL}
                    initialText={newItemInitialText} />
              </div>
            </div>
          )
        }
      </div>
    )
  }
});
