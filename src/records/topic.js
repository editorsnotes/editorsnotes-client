"use strict";

/* eslint camelcase:0 */

var Immutable = require('immutable')

module.exports = Immutable.Record({
  preferred_name: '',
  markup: '',
  alternate_names: Immutable.OrderedSet(),
  related_topics: Immutable.OrderedSet()
});
