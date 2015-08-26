"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'TextEditor',

  getDefaultProps: function () {
    return { html: '', style: {} }
  },

  getInitialState: function () {
    return { editor: null }
  },

  componentDidMount: function () {
    var codemirrorEditor = require('./editor')
      , el = React.findDOMNode(this)
      , editor = codemirrorEditor(el, this.props.html)

    editor.display.wrapper.style.fontFamily = '"Times New Roman"';
    editor.display.wrapper.style.fontSize = '16px';
    editor.display.wrapper.style.height = 'auto';
    editor.display.wrapper.style.border = '1px solid #ccc';
    editor.display.wrapper.style.padding = '1em';

    editor.display.scroller.style.minHeight = '360px';

    editor.refresh();

    editor.on('change', () => this.props.onChange(editor.getValue()));

    this.setState({ editor });
  },

  render: function () {
    return (
      <div>
      </div>
    )

  }
});
