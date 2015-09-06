"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'TextEditor',

  propTypes: {
    projectURL: React.PropTypes.string.isRequired
  },

  getDefaultProps() {
    return {
      html: '',
      style: {}
    }
  },

  getInitialState() {
    return {
      editor: null,
      referenceType: null,
    }
  },

  onAddEmptyReference(type) {
    this.setState({ referenceType: type || 'empty' });
    this.state.editor.on('beforeChange', this.clearReferenceType);

    if (type) this.refs.referenceForm.focusAutocomplete();
  },

  clearReferenceType() {
    this.setState({ referenceType: null });
    this.state.editor.off('beforeChange', this.clearReferenceType);
  },

  componentDidMount() {
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

  render() {
    var References = require('./references.jsx')
      , { projectURL } = this.props
      , { referenceType } = this.state

    return (
      <div className="row">
        <div className="span7">
          <div ref="content" />
        </div>
        <div className="span5">
          <References
              ref="referenceForm"
              type={referenceType}
              projectURL={projectURL}
              onSelect={() => null} />
        </div>
      </div>
    )
  }
});
