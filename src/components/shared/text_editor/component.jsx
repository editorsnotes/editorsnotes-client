"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'TextEditor',

  propTypes: {
    projectURL: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    handleSave: React.PropTypes.func,

    embeddedItems: React.PropTypes.instanceOf(Immutable.Set),
    onAddEmbeddedItem: React.PropTypes.func,

    html: React.PropTypes.string,
    minimal: React.PropTypes.bool,
    noCodeMirror: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      style: {},
      minimal: false
    }
  },

  getInitialState() {
    return {
      referenceType: null,
    }
  },

  onAddEmptyReference(type) {
    this.setState({ referenceType: type || 'empty' });
    this.state.editor.on('beforeChange', this.clearReferenceType);
  },

  clearReferenceType() {
    this.setState({ referenceType: null });
    this.state.editor.off('beforeChange', this.clearReferenceType);
  },

  handleReferenceSelect(item) {
    var { getType } = require('../../../helpers/api')
      , { onAddEmbeddedItem } = this.props
      , { editor } = this.state

    editor.focus();

    onAddEmbeddedItem(item);

    setTimeout(() => {
      if (getType(item) === 'Document') {
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
          editor.replaceSelection(`${item.get('id')}\n\n\n\n:::`);
          editor.setSelection({ line: end.line + 2, ch: 0 });
        } else {
          editor.doc.setSelection(start, end);
          editor.doc.replaceSelection(`[@@d${item.get('id')}]`);
        }


      } else {
        editor.doc.replaceSelection(item.get('id') + ' ');
      }
    }, 0)
  },

  renderReferences() {
    var References = require('./references.jsx')
      , { projectURL, embeddedItems, onAddEmbeddedItem } = this.props
      , { referenceType } = this.state

    return (
      <div className="TextEditor--references col-12 ml3 border bg-white">
        <References
            type={referenceType}
            projectURL={projectURL}
            embeddedItems={embeddedItems}
            onSelect={this.handleReferenceSelect}
            onAddEmbeddedItem={onAddEmbeddedItem} />
        { /* FIXME
        <div className="center">
          <button onClick={handleSave} className="btn btn-primary">Save</button>
        </div>
        */ }
      </div>
    )
  },

  render() {
    var { minimal, noCodeMirror, html } = this.props

    return (
      <div className="bg-gray py2 px1 flex" style={{ justifyContent: 'center' }}>
        <div className="TextEditor--editor col-12 p4 border bg-white">
          <div ref="content">
            { noCodeMirror && html }
          </div>
        </div>

        { !minimal && this.renderReferences() }
      </div>
    )
  }
});
