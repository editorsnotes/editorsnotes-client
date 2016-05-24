"use strict";

const Immutable = require('immutable')

exports.Store = Immutable.Record({
  jed: null,
  user: null,
  application: Immutable.Map({
    current: null,
    next: null
  }),
  resources: Immutable.Map(),
});

exports.Resource = Immutable.Record({
  readyState: null,
  error: null,
  data: null,
  triples: null
});

exports.Route = Immutable.Record({
  path: null,
  APIPath: null,
  readyState: null,
  error: null,
});

Object.freeze(exports);
