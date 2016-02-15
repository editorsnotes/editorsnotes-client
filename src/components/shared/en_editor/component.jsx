"use strict";

var React = require('react')
  , ReactDOM = require('react-dom')


module.exports = React.createClass({
  displayName: 'ENContentEditor',

  propTypes: {
    html: React.PropTypes.string.isRequired,
    onAddEmbeddedItem: React.PropTypes.func,
    projectURL: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    defaultPane: React.PropTypes.string,
    additionalPanes: React.PropTypes.array
  },

  getInitialState() {
    return {
      dragEl: null,
      rightWidth: null,

      isFirefox: (
        global.navigator &&
        global.navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      ),

      newItemType: null,
      newItemInitialText: null,

      selectingReferenceType: null,
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    var shouldUpdate = require('../../../utils/should_update')

    return (
      shouldUpdate(this.props, nextProps, ['html']) ||
      shouldUpdate(this.state, nextState)
    )
  },

  handleDragStart(e) {
    var { isFirefox } = this.state
      , dragEl = document.createElement('span')


    // Firefox doesn't set pageX on ondrag events. Boo.
    // See https://bugzil.la/505521
    if (isFirefox) document.ondragover = this.handleDrag;


    // Browsers are inconsistent about whether the setDragImage element has
    // to be visible or not. This seems to take care of it.
    dragEl.style.height = '1px';
    dragEl.style.width = '1px';
    dragEl.style.background = 'red';
    dragEl.style.opacity = '0.1';
    dragEl.style.position = 'absolute';
    dragEl.style.top = '0';


    document.body.appendChild(dragEl);
    e.dataTransfer.setDragImage(dragEl, 0, 0);
    e.dataTransfer.setData('nothing', '');


    this.setState({
      dragEl,
      offset: document.body.clientWidth
    });

    return true;
  },

  handleDragEnd() {
    var { dragEl, isFirefox } = this.state

    if (isFirefox) document.ondragover = undefined;
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

  handleReferenceAdd(itemType, selectedItem) {
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

    this.setState({
      newItemType: null,
      newItemInitialText: null,
      selectingReferenceType: null,
    });

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
          editor.replaceSelection(`${selectedItem.get('id')}\n\n\n\n ::: `);
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
      , { dragEl, isFirefox, rightWidth, selectingReferenceType, newItemType, newItemInitialText } = this.state
      , initial = rightWidth === null

    return (
      <div>
        <TopBar
            ref="topBar"
            {...this.props}
            {...this.state}
            handleReferenceSelect={this.handleReferenceSelect}
            handleReferenceAdd={this.handleReferenceAdd}
            handleClickAddItem={this.handleClickAddItem} />

        <div className="flex bg-white" style={{ height: 'calc(100vh - 84px)', overflowY: 'hidden' }}>
          <div
              ref="left"
              className="relative"
              style={{ flex: initial ? '3 3 0' : '1 0 auto' }}>

            <div className={(dragEl && isFirefox) ? 'display-none' : ''}>
              <TextEditor
                  ref="textEditor"
                  onAddEmptyReference={this.handleAddEmptyReference}
                  {...this.props} />
            </div>
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
                    onSelect={
                      selectingReferenceType ?
                        this.handleReferenceSelect :
                        this.handleReferenceAdd.bind(null, newItemType)
                    }
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
