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


function fetchUser(headers={}) {
  return dispatch => {
    const url = global.API_URL + '/me/'

    headers.Accept = 'application/ld+json';

    return apiFetch(url, { headers })
      .then(resp => resp.status === 403
        ? null
        : resp.json().then(data => dispatch(
            receiveAPIResource(url, Immutable.fromJS(data))
          ))
      )
  }
}


module.exports = {
  fetchAPIResource,
  fetchUser,
  navigateToPath
}
