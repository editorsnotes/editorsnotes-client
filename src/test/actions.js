const test = require('blue-tape')
    , sinon = require('sinon')
    , thunk = require('redux-thunk').default
    , configureMockStore = require('redux-mock-store')
    , Immutable = require('immutable')

const mockStore = configureMockStore([thunk])

const {
  REQUEST_API_RESOURCE,
} = require('../types').actions

const {
  PENDING,
  SUCCESS,
  FAILURE,
} = require('../types').readyStates

if (!process.browser) {
  global.fetch = () => null;
  global.API_URL = 'http://testserver'
}


test('Fetching API resource', t => {
  const { fetchAPIResource } = require('../actions')

  const stub = sinon.stub(global, 'fetch')
      , store = mockStore()

  stub.onCall(0).returns(Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({
      key: 'value'
    })
  }))

  stub.onCall(1).returns(Promise.resolve({
    status: 404,
    headers: new Map([
      ['Content-Type', 'application/json']
    ]),
    json: () => Promise.resolve({
      detail: 'Page not found'
    })
  }))

  return Promise.resolve()
    .then(() =>
      store.dispatch(fetchAPIResource('/topics/123/'))
        .then(() => {
          t.deepEqual(
            Immutable.fromJS(store.getActions()).toJS(),
            Immutable.fromJS([
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
            ]).toJS()
          )

          store.clearActions();
        })
    )
    .then(() =>
      store.dispatch(fetchAPIResource('/qwyjibo/'))
        .then(() => {
          t.deepEqual(
            Immutable.fromJS(store.getActions()).toJS(),
            Immutable.fromJS([
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
            ]).toJS()
          );

          stub.restore();
        })
    )
})
