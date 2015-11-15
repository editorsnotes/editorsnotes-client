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
      editor: null,
      referenceType: null,
    }
  },

  componentDidMount() {
    var { noCodeMirror } = this.props

    if (noCodeMirror) return;

    this.initCitationEngine();
    setTimeout(this.refreshCiteprocEngine, 0);
    setTimeout(this.initCodeMirror, 0);
  },


  onAddEmptyReference(type) {
    this.setState({ referenceType: type || 'empty' });
    this.state.editor.on('beforeChange', this.clearReferenceType);
  },

  clearReferenceType() {
    this.setState({ referenceType: null });
    this.state.editor.off('beforeChange', this.clearReferenceType);
  },

  refreshCiteprocEngine() {
    var cslFromDocuments = require('editorsnotes-markup-renderer/lib/csl_from_documents')
      , { embeddedItems } = this.props
      , { citationGenerator } = this.state
      , documentsByURL

    documentsByURL = embeddedItems
      .filter(item => item.get('type').indexOf('Document') !== -1)
      .toMap()
      .mapKeys((key, item) => item.get('id'))

    citationGenerator.items = cslFromDocuments(documentsByURL.toJS())
    citationGenerator.engine.updateItems(documentsByURL.keySeq().toJS())
  },

  getItemFromURL(itemURL) {
    var apiFetch = require('../../../utils/api_fetch')
      , { embeddedItems, onAddEmbeddedItem } = this.props
      , item
      , promise

    item = embeddedItems.find(_item => _item.get('url') === itemURL);

    if (item) {
      promise = Promise.resolve(item);
    } else {
      promise = apiFetch(itemURL)
        .then(resp => resp.json())
        .then(Immutable.fromJS)
        .then(onAddEmbeddedItem)
        .then(() => setTimeout(this.refreshCiteprocEngine, 0))
    }

    return promise;
  },

  getEmbeddedItem(itemType, itemID) {
    var { projectURL } = this.props
      , itemURL = `${projectURL}${itemType}s/${itemID}/`

    return this.getItemFromURL(itemURL);
  },

  getReferenceLabel(itemType, itemID) {
    var resolveItemText = require('editorsnotes-markup-renderer/lib/resolve_item_text')

    return this.getEmbeddedItem(itemType, itemID)
      .then(item => {
        var id = item.get('id')
          , data = { [itemType]: { [id]: item.toJS() }}

        return resolveItemText(data, itemType, id)
      })
  },

  getInlineCitation(itemID) {
    var makeInlineCitation = require('editorsnotes-markup-renderer/lib/make_inline_citation')
      , { citationGenerator } = this.state

    return this.getEmbeddedItem('document', itemID)
      .then(item => makeInlineCitation(citationGenerator.engine, [item.toJS()]))
      .then(({ citations }) => citations[0]);
  },

  getFullCitation(itemID) {
    var makeBibliographyEntry = require('editorsnotes-markup-renderer/lib/make_bibliography_entry')
      , { citationGenerator } = this.state

    return this.getEmbeddedItem('document', itemID)
      .then(item => makeBibliographyEntry(citationGenerator.engine, item.toJS()))
  },

  initCitationEngine() {
    var CitationGenerator = require('../../../utils/citation_generator')

    this.setState({
      citationGenerator: new CitationGenerator('chicago-author-date')
    });
  },

  initCodeMirror() {
    var { findDOMNode } = require('react-dom')
      , codemirrorEditor = require('./editor')
      , { html, minimal, onChange } = this.props
      , cmOpts
      , editor

    cmOpts = {
      getReferenceLabel: this.getReferenceLabel,
      getInlineCitation: this.getInlineCitation,
      getFullCitation: this.getFullCitation
    }

    if (!minimal) {
      cmOpts.handleAddReference = this.onAddEmptyReference;
    }

    editor = codemirrorEditor(findDOMNode(this.refs.content), html, cmOpts);

    editor.display.wrapper.style.fontFamily = '"Times New Roman"';
    editor.display.wrapper.style.fontSize = '16px';
    editor.display.wrapper.style.lineHeight = '19px';

    editor.display.wrapper.style.height = 'auto';
    editor.display.scroller.style.minHeight = '480px';

    editor.on('change', () => onChange(editor.getValue()));

    this.setState({ editor }, () => editor.refresh())
  },

  handleReferenceSelect(item) {
    var { editor } = this.state

    editor.focus();
    editor.doc.replaceSelection(item.get('id') + ' ');
  },

  renderReferences() {
    var References = require('./references.jsx')
      , { projectURL, embeddedItems, onAddEmbeddedItem, handleSave } = this.props
      , { referenceType } = this.state

    return (
      <div className="TextEditor--references col-12 ml3 p4 border bg-white flex flex-column">
        <div className="flex-grow" style={{ marginTop: '-4rem' }}>
          <References
              type={referenceType}
              projectURL={projectURL}
              embeddedItems={embeddedItems}
              onSelect={this.handleReferenceSelect}
              onAddEmbeddedItem={onAddEmbeddedItem} />
        </div>
        <div className="center">
          <button onClick={handleSave} className="btn btn-primary">Save</button>
        </div>
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
