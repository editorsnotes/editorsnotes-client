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


function dispatchReadyState(dispatch, type) {
  const started = new Date().getTime()
      , requestID = Math.random().toString(16).slice(2)

  return (readyState, opts) =>
    dispatch(Object.assign({}, opts, {
      requestID,
      type,
      readyState,
      started,
      updated: new Date().getTime(),
    }))
}


function navigateToPath(router, path, req=null) {
  return dispatch => {
    const match = router.match(path)
        , { resource, makeTripleStore } = match.handler
        , apiPath = resource ? resource(path) : null
        , skipUserRequest = req && req.headers.cookie.indexOf('sessionid' === -1)
        , headers = {}

    const updateRequest = dispatchReadyState(dispatch, REQUEST_NAVIGATION);

    if (req) {
      headers.Host = req.headers.host;
      headers.cookie = req.headers.cookie;
    }

    const { requestID } = updateRequest(PENDING, { path, apiPath });

    const promises = [
      !skipUserRequest && dispatch(fetchAPIResource('/me/', { headers })).promise,
      apiPath && dispatch(
        fetchAPIResource(apiPath, { headers }, makeTripleStore)
      ).promise
    ]

    const promise = Promise.all(promises).then(
      () => {
        updateRequest(SUCCESS, { path, apiPath });
      },
      err => {
        updateRequest(FAILURE, { path, apiPath, err });
      }
    )

    return { requestID, promise }
  }
}

const PASSED_HEADERS = [
  'Location',
  'Date',
  'Content-Type',
]

function fetchAPIResource(url, opts={}, parseTriples=false) {
  return (dispatch) => {
    let statusCode
      , responseHeaders = {}

    const updateRequest = dispatchReadyState(dispatch, REQUEST_API_RESOURCE);

    if (!process.browser) {
      url = global.API_URL + url;
    }

    const { requestID } = updateRequest(PENDING, { url });

    opts.headers = Object.assign({}, opts.headers, {
      Accept: 'application/ld+json'
    });

    const promise = apiFetch(url, opts)
      .then(resp => {
        PASSED_HEADERS.forEach(header => {
          const value = resp.headers.get(header);

          if (value) {
            responseHeaders[header] = value;
          }
        });

        return resp;
      })
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
        updateRequest(SUCCESS, {
          url,
          statusCode,
          responseHeaders,
          responseData: Immutable.fromJS(data),
          responseTriples: Immutable.fromJS(triples)
        })
      })
      .catch(err => {
        // TODO: Log stacktrace
        updateRequest(FAILURE, {
          url,
          statusCode: err.statusCode,
          responseHeaders,
          responseError: Immutable.fromJS(err.data)
            .delete('@context')
            .delete('hydra:operation')
        });
      });

    return { requestID, promise }
  }
}


function typeFromRecord(record) {
  const Note = require('./records/note')
      , Topic = require('./records/topic')
      , Document = require('./records/document')

  if (record instanceof Document) return 'document';
  if (record instanceof Topic) return 'topic';
  if (record instanceof Note) return 'note';

  throw new Error('Could not detect item type from record.');
}


function saveItem(id, record) {
  return (dispatch, getState) => {
    const projectURL = getState().getIn(['application', 'currentProjectURL'])
        , isNew = id === null
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
