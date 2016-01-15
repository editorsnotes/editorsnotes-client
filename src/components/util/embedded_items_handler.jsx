"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = function makeEmbeddedItemsHandler(Component) {
  var EmbeddedItemsHandler = React.createClass({
    propTypes: {
      embeddedItems: React.PropTypes.instanceOf(Immutable.Set).isRequired,
      onAddEmbeddedItem: React.PropTypes.func.isRequired
    },

    getInitialState() {
      return { citationGenerator: null }
    },

    initCitationEngine() {
      var CitationGenerator = require('../../utils/citation_generator')

      this.setState({
        citationGenerator: new CitationGenerator('chicago-author-date')
      });
    },

    componentDidMount() {
      this.initCitationEngine();
      setTimeout(this.refreshCiteprocEngine, 0);
    },

    getEmbeddedItem(itemType, itemID) {
      var { projectURL } = this.props
        , itemURL = `${projectURL}${itemType}s/${itemID}/`

      return this.getItemFromURL(itemURL).then(item => {
        if (itemType === 'document') this.refreshCiteprocEngine();
        return item;
      });
    },


    getItemFromURL(itemURL) {
      var apiFetch = require('../../utils/api_fetch')
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
          .then(newItem => {
            onAddEmbeddedItem(newItem);
            return newItem;
          })
      }

      return promise;
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

    render() {
      return (
        <Component
            {...this.props}
            getEmbeddedItem={this.getEmbeddedItem}
            getReferenceLabel={this.getReferenceLabel}
            getInlineCitation={this.getInlineCitation}
            getFullCitation={this.getFullCitation} />
      )
    }
  });

  return EmbeddedItemsHandler;
}
