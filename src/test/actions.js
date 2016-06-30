"use strict";

const test = require('blue-tape')
    , sinon = require('sinon')
    , Immutable = require('immutable')
    , { mockStore, mockResponse } = require('./mocks')

const {
  REQUEST_API_RESOURCE,
} = require('../types').actions

const {
  PENDING,
  SUCCESS,
  FAILURE,
} = require('../types').readyStates


function normalize(actionLists) {
  return Immutable.fromJS(actionLists)
    .map(actionList =>
      actionList.map(action =>
        action.delete('id').delete('started').delete('updated')))
    .toJS()
}


if (!process.browser) {
  global.fetch = () => null;
  global.API_URL = 'http://testserver'
}


test('API fetching actions', t => {
  const { fetchAPIResource } = require('../actions')
      , stub = sinon.stub(global, 'fetch')
      , store = mockStore()

  stub
    .onCall(0)
    .returns(mockResponse(200, { key: 'value' }))

  stub
    .onCall(1)
    .returns(mockResponse(404, { detail: 'Page not found' }))

  return Promise.resolve()
    .then(() =>
      store.dispatch(fetchAPIResource('/topics/123/'))
        .then(() => {
          t.deepEqual(...normalize([
            store.getActions(),
            [
              {
                type: REQUEST_API_RESOURCE,
                readyState: PENDING,
                url: 'http://testserver/topics/123/'
              },
              {
                type: REQUEST_API_RESOURCE,
                readyState: SUCCESS,
                url: 'http://testserver/topics/123/',
                statusCode: 200,
                responseData: { key: 'value' },
                responseTriples: false
              }
            ]
          ]));

          store.clearActions();
        })
    )
    .then(() =>
      store.dispatch(fetchAPIResource('/qwyjibo/'))
        .then(() => {
          t.deepEqual(...normalize([
            store.getActions(),
            [
              {
                type: REQUEST_API_RESOURCE,
                readyState: PENDING,
                url: 'http://testserver/qwyjibo/'
              },
              {
                type: REQUEST_API_RESOURCE,
                readyState: FAILURE,
                url: 'http://testserver/qwyjibo/',
                statusCode: 404,
                responseError: {
                  detail: 'Page not found'
                }
              }
            ]
          ]));

          stub.restore();
        })
    )
});
