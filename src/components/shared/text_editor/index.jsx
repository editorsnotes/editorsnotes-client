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

  onAddEmptyReference(type) {
    this.setState({ referenceHint: type || 'empty' });
    this.state.editor.on('beforeChange', this.clearReferenceHint);
  },

  clearReferenceHint() {
    this.setState({ referenceHint: null });
    this.state.editor.off('beforeChange', this.clearReferenceHint);
  },

  componentDidMount: function () {
    var codemirrorEditor = require('./editor')
      , el = React.findDOMNode(this.refs.content)
      , editor

    editor = codemirrorEditor(el, this.props.html, {
      handleAddReference: this.onAddEmptyReference
    });

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
      <div className="row">
        <div className="span7">
          <div ref="content" />
        </div>
        <div className="span5">
          <h3>References</h3>
          <div>
            {
              this.state.referenceHint && (
                  this.state.referenceHint === 'empty' ?
                    <p>Type 'd' for document, 'n' for note, or 't' for topic</p> :
                    <div>
                      <label>
                        <strong>Find { this.state.referenceHint }</strong>
                        <br />
                        <input />
                      </label>
                    </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }
});
