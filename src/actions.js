"use strict";

const Immutable = require('immutable')
    , apiFetch = require('./utils/api_fetch')
    , handleResponse = require('./utils/handle_response')
    , parseLD = require('./utils/parse_ld')


const {
  REQUEST_API_RESOURCE,
  REQUEST_NAVIGATION,
} = require('./types').actions

const {
  PENDING,
  SUCCESS,
  FAILURE,
} = require('./types').readyStates


function dispatchReadyState(dispatch, type, readyState, opts) {
  return dispatch(Object.assign({}, opts, { type, readyState }));
}


function navigateToPath(router, path, req=null) {
  return dispatch => {
    const match = router.match(path)
        , { resource, makeTripleStore } = match.handler
        , resourceURL = resource ? resource(path) : null
        , headers = {}

    const updateReadyState = dispatchReadyState.bind(
      null,
      dispatch,
      REQUEST_NAVIGATION
    );

    if (req) {
      headers.Host = req.headers.host;
      headers.cookie = req.headers.cookie;
    }

    updateReadyState(PENDING, { path });

    const promises = [
      dispatch(fetchAPIResource('/me/')),
      resourceURL && dispatch(
        fetchAPIResource(resourceURL, headers, makeTripleStore)
      )
    ]

    return Promise.all(promises)
      .then(() => {
        updateReadyState(SUCCESS, { path });
      })
      .catch(err => {
        updateReadyState(FAILURE, { path, err });
      })

  }
}

function fetchAPIResource(url, opts={}, parseTriples=false) {
  return (dispatch) => {
    let statusCode

    const updateReadyState = dispatchReadyState.bind(
      null,
      dispatch,
      REQUEST_API_RESOURCE
    );

    if (!process.browser) {
      url = global.API_URL + url;
    }

    updateReadyState(PENDING, { url });

    opts.headers = Object.assign({}, opts.headers, {
      Accept: 'application/ld+json'
    });

    return apiFetch(url, opts)
      .then(handleResponse)
      .then(resp => {
        statusCode = resp.status;

        return resp.json();
      })
      .then(data => Promise.all([
        data,
        Promise.resolve(parseTriples && parseLD(data))
      ]))
      .then(([data, triples]) => {
        updateReadyState(SUCCESS, {
          url,
          statusCode,
          responseData: Immutable.fromJS(data),
          responseTriples: triples
        })
      })
      .catch(err => {
        // TODO: Log stacktrace
        updateReadyState(FAILURE, {
          url,
          statusCode: err.statusCode,
          responseError: err.data
        });
      });
  }
}


function typeFromRecord(record) {
  const Note = require('../../records/note')
      , Topic = require('../../records/topic')
      , Document = require('../../records/document')

  if (record instanceof Document) return 'document';
  if (record instanceof Topic) return 'topic';
  if (record instanceof Note) return 'note';

  throw new Error('Could not detect item type from record.');
}

function saveItem(id, projectURL, record) {
  return dispatch => {
    const isNew = id === null
        , type = typeFromRecord(record)
        , method = isNew ? 'post' : 'put'
        , body = JSON.stringify(record)

    let url = `${projectURL}${type}s/`

    if (!isNew) {
      url += `${id}/`;
    }

    if (type === 'topic' && !isNew) {
      url += 'w/';
    }

    return dispatch(fetchAPIResource(url, { method, body }));
  }
}


module.exports = {
  fetchAPIResource,
  navigateToPath,
  saveItem,
}
