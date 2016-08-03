"use strict";

const Immutable = require('immutable')

exports.ApplicationState = Immutable.Record({
  jed: null,
  user: null,

  application: Immutable.Map({
    currentProjectURL: null,
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
  responseError: null,
  responseHeaders: null,

  /*
  responseData: null,
  responseTriples: null,
  */
}, 'APIRequest');

exports.APIResource = Immutable.Record({
  url: null,
  data: null,
  triples: null,
  updated: null,
}, 'APIResource')

exports.Route = Immutable.Record({
  path: null,
  apiPath: null,
  readyState: null,
  error: null,
}, 'Route');

Object.freeze(exports);
