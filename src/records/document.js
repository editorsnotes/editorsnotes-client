"use strict";

/* eslint camelcase:0 */

var Immutable = require('immutable')

module.exports = Immutable.Record({
  description: '',
  zotero_data: null,
  related_topics: Immutable.List(),
  scans: Immutable.List()
});
