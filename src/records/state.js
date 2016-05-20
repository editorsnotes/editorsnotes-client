"use strict";

const Immutable = require('immutable')

module.exports = Immutable.Record({
  currentPath: null,
  currentAPIPath: null,
  user: null,

  resources: Immutable.Map(),

  jed: null
});
