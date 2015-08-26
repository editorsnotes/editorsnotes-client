"use strict";

/* eslint camelcase:0 */

var Immutable = require('immutable')

module.exports = Immutable.Record({
  title: '',
  status: 'open',
  is_private: false,
  license: null,
  related_topics: Immutable.List(),
  markup: ''
});
