"use strict";

/* eslint camelcase:0 */

var Immutable = require('immutable')

module.exports = Immutable.Record({
  preferred_name: '',
  summary: '',
  alternate_names: Immutable.List(),
  related_topics: Immutable.List()
});
