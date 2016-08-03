"use strict";

const thunk = require('redux-thunk').default
    , configureMockStore = require('redux-mock-store')

const mockStore = configureMockStore([thunk])

function mockResponse(status, data, headers={}) {
  const resp = {
    status,
    ok: status >= 200 && status <= 299,
    json: () => Promise.resolve(data),
  }

  const headerMap = new Map([
    ['Content-Type', 'application/json']
  ]);

  Object.keys(headers).forEach(key => {
    headerMap.set(key, headers[key]);
  })

  resp.headers = headerMap;

  return Promise.resolve(resp);
}

module.exports = {
  mockStore,
  mockResponse,
}


