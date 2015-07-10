"use strict";

/* eslint camelcase:0 */

var Immutable = require('immutable')

module.exports = Immutable.Record({
  title: '',
  content: '',
  status: 'open',
  is_private: false,
  license: null,
  related_topics: Immutable.List(),
  sections: Immutable.List()
});
