const Immutable = require('immutable')
    , State = require('./records/state')

module.exports = function rootReducer(state=(new State()), action) {
  switch (action.type) {
    case 'API_REQUEST':
      return state.setIn(['pendingAPIRequests', action.requestID], Immutable.Map({
        loading: true,
        statusCode: null,
        errors: []
      }))

    case 'API_RECEIVE':
      return state
        .update(['pendingAPIRequests', action.requestID], status =>
          status
            .set('loading', false)
            .set('statusCode', action.statusCode)
            .set('errors', action.errors))
        .setIn(['resources', action.uri], action.data)
        .update('tripleStore', tripleStore => {
          tripleStore.add(action.triples)

          return tripleStore;
        })
    default:
      return state;
  }
}
