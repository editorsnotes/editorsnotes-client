"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'TextEditor',

  propTypes: {
    projectURL: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    embeddedItems: React.PropTypes.instanceOf(Immutable.Map),
    html: React.PropTypes.string,
    minimal: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      html: '',
      style: {},
      minimal: false
    }
  },

  getInitialState() {
    return {
      editor: null,
      referenceType: null,
      embeddedItems: Immutable.Map({
        note: Immutable.OrderedSet(),
        topic: Immutable.OrderedSet(),
        document: Immutable.OrderedSet()
      })
    }
  },

  componentWillMount() {
    var { embeddedItems } = this.props

    if (!embeddedItems) return;

    this.setState(prev => ({
      embeddedItems: prev.embeddedItems.map((set, itemType) => set.union(embeddedItems.get(itemType)))
    }));
  },

  onAddEmptyReference(type) {
    this.setState({ referenceType: type || 'empty' });
    this.state.editor.on('beforeChange', this.clearReferenceType);
  },

  clearReferenceType() {
    this.setState({ referenceType: null });
    this.state.editor.off('beforeChange', this.clearReferenceType);
  },

  getItemFromID(itemType, itemID) {
    var cslFromDocuments = require('editorsnotes-markup-renderer/lib/csl_from_documents')
      , { projectURL } = this.props
      , { embeddedItems, citationGenerator } = this.state
      , item
      , promise

    item = embeddedItems
      .get(itemType)
      .find(_item => _item.get('id') === itemID)

    if (item) {
      promise = Promise.resolve(item);
    } else {
      let opts = {
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json; charset=utf-8'
        }
      }

      promise = fetch(`${projectURL}${itemType}s/${itemID}/`, opts)
        .then(resp => resp.json())
        .then(Immutable.fromJS)
        .then(fetchedItem => new Promise(resolve => {
          this.setState(prev => ({
            embeddedItems: prev.embeddedItems.update(itemType, set => set.add(fetchedItem))
          }), () => {
            if (itemType === 'document') {
              let documentsByID
                , itemIDs

              documentsByID = this.state.embeddedItems
                .get('document')
                .toMap()
                .mapKeys((key, item) => item.get('id'))
                .toJS()

              itemIDs = this.state.embeddedItems
                .get('document')
                .map(_item => _item.get('id'))
                .toJS()

              this.state.citationGenerator.items = cslFromDocuments(documentsByID);
              this.state.citationGenerator.engine.updateItems(itemIDs);
            }
            resolve(fetchedItem);
          });
        }));
    }

    return promise;
  },

  getReferenceLabel(itemType, itemID) {
    var resolveItemText = require('editorsnotes-markup-renderer/lib/resolve_item_text')

    return this.getItemFromID(itemType, itemID)
      .then(item => {
        var id = item.get('id')
          , data = { [itemType]: { [id]: item.toJS() }}

        return resolveItemText(data, itemType, id)
      })
  },

  getInlineCitation(itemID) {
    var makeInlineCitation = require('editorsnotes-markup-renderer/lib/make_inline_citation')

    return this.getItemFromID('document', itemID)
      .then(item => makeInlineCitation(this.state.citationGenerator.engine, [item.toJS()]))
      .then(({ citations }) => citations[0]);
  },

  getFullCitation(itemID) {
    var makeBibliographyEntry = require('editorsnotes-markup-renderer/lib/make_bibliography_entry')
      , { citationGenerator } = this.state

    return this.getItemFromID('document', itemID)
      .then(item => makeBibliographyEntry(citationGenerator.engine, item.toJS()))
  },

  componentDidMount() {
    var codemirrorEditor = require('./editor')
      , CitationGenerator = require('../../../utils/citation_generator')
      , { html, minimal, onChange } = this.props
      , el = React.findDOMNode(this.refs.content)
      , opts = {}
      , editor

    this.setState({
      citationGenerator: new CitationGenerator('chicago-author-date')
    });

    if (!minimal) {
      opts.handleAddReference = this.onAddEmptyReference;
    }

    opts.getReferenceLabel = this.getReferenceLabel;
    opts.getInlineCitation = this.getInlineCitation;
    opts.getFullCitation = this.getFullCitation;

    editor = codemirrorEditor(el, html, opts);

    editor.display.wrapper.style.fontFamily = '"Times New Roman"';
    editor.display.wrapper.style.fontSize = '16px';
    editor.display.wrapper.style.height = 'auto';
    editor.display.wrapper.style.border = '1px solid #ccc';
    editor.display.wrapper.style.padding = '1em';
    editor.display.scroller.style.minHeight = '360px';

    editor.refresh();

    editor.on('change', () => onChange(editor.getValue()));

    this.setState({ editor });
  },

  handleReferenceSelect(item) {
    this.state.editor.focus();
    this.state.editor.doc.replaceSelection(item.get('id') + ' ');
  },

  render() {
    var References = require('./references.jsx')
      , { projectURL, minimal } = this.props
      , { referenceType } = this.state

    return (
      <div className="row">
        <div className={minimal ? "span12" : "span7"}>
          <div ref="content" />
        </div>
        {
          !minimal && (
            <div className="span5">
              <References
                  type={referenceType}
                  projectURL={projectURL}
                  onSelect={this.handleReferenceSelect} />
            </div>
          )
        }
      </div>
    )
  }
});
