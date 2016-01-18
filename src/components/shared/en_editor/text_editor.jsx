"use strict";

var React = require('react')


module.exports = React.createClass({
  displayName: 'TextEditor',

  propTypes: {
  },

  getInitialState() {
    return {
      editor: null,
      initializing: true
    }
  },

  componentDidMount() {
    var { noCodeMirror } = this.props

    if (noCodeMirror) return;

    setTimeout(this.initCodeMirror, 0);
  },

  initCodeMirror() {
    var { findDOMNode } = require('react-dom')
      , codemirrorEditor = require('./cm_editor')
      , { html, minimal, onChange } = this.props
      , editor

    editor = codemirrorEditor(findDOMNode(this.refs.content), html, this.props);

    this.setState({ initializing: false });

    editor.display.wrapper.style.fontFamily = '"Times New Roman"';
    editor.display.wrapper.style.fontSize = '20px';
    editor.display.wrapper.style.lineHeight = '23px';

    editor.display.wrapper.style.border = '1px solid #ccc';
    editor.display.wrapper.style.borderTop = 'none';
    editor.display.wrapper.style.borderBottom = 'none';
    editor.display.wrapper.style.marginLeft = '-1px';
    editor.display.wrapper.style.marginRight = '-1px';

    editor.display.wrapper.style.height = 'auto';

    editor.display.scroller.style.minHeight = '480px';

    editor.on('change', () => onChange(editor.getValue()));

    this.setState({ editor }, () => editor.refresh())
  },


  render() {
    var { noCodeMirror, html } = this.props
      , { initializing } = this.state

    return (
      <div className="absolute-full-height flex flex-column">
        <div className="flex-grow relative">
          <div className="absolute-full-height bg-lightgray flex flex-stretch" style={{
            overflowY: 'scroll',
            overflowX: 'hidden',
            justifyContent: 'center'
          }}>
            <div className="bg-white" style={{
              width: '100%',
              maxWidth: '740px',
              boxShadow: '0 0 0 1px #ccc'
            }}>
              {
                !noCodeMirror && initializing && (
                  <p className="absolute red" style={{ left: '50%', top: '20%' }}>Loading...</p>
                )
              }
              <div className="ENEditor" ref="content">
                { noCodeMirror && html }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
