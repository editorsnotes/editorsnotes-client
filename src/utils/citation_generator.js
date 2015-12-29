"use strict";

var _ = require('underscore')
  , CSL = require ('../../lib/citeproc-js/citeproc').CSL
  , styles = require('./citeproc_styles')
  , locales = require('./citeproc_locales')

CSL.Output.Formats.text['@font-style/italic'] = '<em>%%STRING%%</em>';
CSL.Output.Formats.html['@bibliography/entry'] = (state, str) => {
  return str;
}
CSL.debug = function () { return; }


function CitationGenerator(style, locale) {
  style = style || 'chicago-fullnote-bibliography';
  locale = locale || 'en-US';
  this.items = {};
  this.engine = this.createEngine(style, locale);
}

CitationGenerator.prototype = {
  createEngine: function (style, locale) {
    var that = this
      , sys = {
        retrieveItem: function (id) { return that.items[id] },
        retrieveLocale: function (locale) { return locales[locale] }
      }
    return new CSL.Engine(sys, styles[style], locale);
  },
  makeCitation: function (data) {
    var citationItems = []

    data = _.isArray(data) ? data : [data];

    _.forEach(data, function (cslItem) {
      if (!cslItem.hasOwnProperty('id')) {
        cslItem.id = data.length > 1 ? _.uniqueId('CSL-ITEM-') : 'ITEM';
      }
      this.items[cslItem.id] = cslItem;
      citationItems.push({ 'id': cslItem.id });
    }, this);

    return this.engine.previewCitationCluster({
      citationItems: citationItems,
      properties: {}
    }, [], [], 'text');
  }
}

module.exports = CitationGenerator;
