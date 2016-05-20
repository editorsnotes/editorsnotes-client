"use strict";

const Immutable = require('immutable')
    , apiFetch = require('./utils/api_fetch')
    , handleResponse = require('./utils/handle_response')
    , parseLD = require('./utils/parse_ld')
    , parseURL = require('url').parse

function requestAPIResource(url) {
  url = parseURL(url).path

  return {
    type: 'REQUEST_API_RESOURCE',
    url
  }
}

function receiveAPIResource(url, data, triples) {
  url = parseURL(url).path

  return {
    type: 'RECEIVE_API_RESOURCE',
    url,
    data,
    triples,
    time: new Date()
  }
}

function receiveUser(data) {
  return {
    type: 'RECEIVE_USER',
    data
  }
}

function fetchAPIResource(url, headers={}, parseTriples=false) {
  return (dispatch) => {
    if (!process.browser) {
      url = global.API_URL + url;
    }

    dispatch(requestAPIResource(url));

    headers.Accept = 'application/ld+json';

    return apiFetch(url, { headers })
      .then(handleResponse)
      .then(resp => resp.json())
      .then(data => Promise.all([
        data,
        Promise.resolve(parseTriples && parseLD(data))
      ]))
      .then(([data, triples]) => {
        dispatch(receiveAPIResource(url, Immutable.fromJS(data), Immutable.fromJS(triples)));

        return [data, triples];
      })
      .catch(err => {
        throw new Error(err);
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

module.exports = { fetchAPIResource, fetchUser }
