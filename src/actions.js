"use strict";

const Immutable = require('immutable')
    , apiFetch = require('./utils/api_fetch')
    , handleResponse = require('./utils/handle_response')
    , parseLD = require('./utils/parse_ld')


const {
  REQUEST_API_RESOURCE
} = require('./types').actions

const {
  PENDING,
  SUCCESS,
  FAILURE,
} = require('./types').readyStates


function navigateToPath(router, path, req=null) {
  return dispatch => {
    const match = router.match(path)

    dispatch(navigationRequest(path));

    const { resource, makeTripleStore } = match.handler
        , resourceURL = resource ? resource(path) : null
        , headers = {}

    if (req) {
      headers.Host = req.headers.host;
      headers.cookie = req.headers.cookie;
    }

    const promises = [
      dispatch(fetchUser(headers)),
      resourceURL && dispatch(
        fetchAPIResource(resourceURL, headers, makeTripleStore)
      )
    ]

    return Promise.all(promises)
      .then(() => {
        dispatch(navigationSucess(path, resourceURL));
      })
      .catch(err => {
        dispatch(navigationError(path, err));
      })

  }
}

function fetchAPIResource(url, opts={}, parseTriples=false) {
  return (dispatch) => {
    let statusCode

    if (!process.browser) {
      url = global.API_URL + url;
    }

    dispatch({
      type: REQUEST_API_RESOURCE,
      url,
      readyState: PENDING,
    })

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
        dispatch({
          type: REQUEST_API_RESOURCE,
          url,
          readyState: SUCCESS,
          statusCode,

          responseData: Immutable.fromJS(data),
          responseTriples: triples
        })

        return [data, triples];
      })
      .catch(err => {
        // TODO: Log stacktrace
        dispatch({
          type: REQUEST_API_RESOURCE,
          url,
          readyState: FAILURE,
          statusCode: err.statusCode,

          responseError: err.data
        })
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
