"use strict";

const Immutable = require('immutable')

exports.ApplicationState = Immutable.Record({
  jed: null,
  user: null,

  application: Immutable.Map({
    current: null,
    next: null
  }),

  resources: Immutable.Map(),
  requests: Immutable.Map(),
}, 'ApplicationState');

exports.APIRequest = Immutable.Record({
  requestID: null,
  url: null,
  type: null,
  started: null,
  updated: null,
  readyState: null,
  statusCode: null,

  payload: null,
  responseData: null,
  responseTriples: null,

  responseError: null
}, 'APIRequest');

exports.Route = Immutable.Record({
  path: null,
  APIPath: null,
  readyState: null,
  error: null,
}, 'Route');

Object.freeze(exports);
