"use strict";

var React = require('react')
  , FullToolbar


function renderCommand(command, value, btnText) {
  var props = {}

  props.className = 'btn';
  props['data-wysihtml5-command'] = command;

  if (value) {
    props['data-wysihtml5-command-value'] = value;
  }

  return <a {...props}>{btnText}</a>
}

function icon(type) {
  return <i className={'fa fa-' + type} />
}

FullToolbar = React.createClass({
  render: function () {
    return (
      <div id={this.props.id} className="btn-toolbar wysihtml5-toolbar">
        <div className="btn-group">
          {renderCommand('bold', null, icon('bold'))}
          {renderCommand('italic', null, icon('italic'))}

          {renderCommand('formatBlock', 'p', <strong>P</strong>)}
          {renderCommand('formatBlock', 'h1', <strong>H1</strong>)}
          {renderCommand('formatBlock', 'h2', <strong>H2</strong>)}
          {renderCommand('formatBlock', 'h3', <strong>H3</strong>)}

          {renderCommand('insertOrderedList', null, icon('list-ol'))}
          {renderCommand('insertUnorderedList', null, icon('list-ul'))}
          {renderCommand('createLink', null, icon('link'))}
        </div>

        <div data-wysihtml5-dialog="createLink" style={{ display: 'none' }}>
          <label>
            Link:
            <input data-wysihtml5-dialog-field="href" defaultValue="http://" />
          </label>
          <a data-wysihtml5-dialog-action="save" className="btn">OK</a>
          <a data-wysihtml5-dialog action="cancel" className="btn">Cancel</a>
        </div>

      </div>
    )
  }
});

module.exports = React.createClass({
  displayName: 'TextEditor',

  getDefaultProps: function () {
    return { html: '', style: {} }
  },

  getInitialState: function () {
    return { editor: null }
  },

  componentWillReceiveProps: function (nextProps) {
    if (!this.state.editor) return;

    if ('html' in nextProps && nextProps.html !== this.state.editor.getValue()) {
      this.state.editor.setValue(nextProps.html);
    }
  },

  componentDidMount: function () {
    var wysihtml = require('wysihtml')
      , editorEl = React.findDOMNode(this.refs.text)
      , toolbarEl = React.findDOMNode(this.refs.toolbar)
      , editor

    editor = new wysihtml.Editor(editorEl, { toolbar: toolbarEl })

    if (this.props.onChange) {
      editor.on('load', () => editor.setValue(this.props.html));
      editor.on('interaction', () => {
        var val = editor.getValue();
        this.props.onChange(val);
      })
    }

    this.setState({ editor });
  },

  render: function () {
    return (
      <div className="html-editor">
        <FullToolbar ref="toolbar" />
        <div
            ref="text"
            style={this.props.style}
            className="html-editor-data" />
      </div>
    )

  }
});
