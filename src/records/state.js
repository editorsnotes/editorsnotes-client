"use strict";

const Immutable = require('immutable')

module.exports = Immutable.Record({
  currentPath: null,
  currentAPIPath: null,
  user: null,

  pendingAPIRequests: Immutable.Map(),
  resources: Immutable.Map(),

  tripleStore: null,
  jed: null
});
