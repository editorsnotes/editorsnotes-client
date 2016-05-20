const Immutable = require('immutable')
    , State = require('./records/state')

module.exports = function rootReducer(state=(new State()), action) {
  switch (action.type) {
    case 'REQUEST_API_RESOURCE':
      return state.setIn(['resources', action.url], Immutable.Map({
        readyState: 'loading',
        error: null,
        data: null
      }));

    case 'RECEIVE_API_RESOURCE':
      const updatedState = state.setIn(['resources', action.url], Immutable.Map({
        readyState: 'success',
        error: null,
        data: action.data,
        triples: action.triples || null
      }))

      return action.url !== '/me/'
        ? updatedState
        : updatedState.set('user', updatedState.getIn(['resources', '/me/', 'data']))

    case 'ERRORED_API_RESOURCE':
      return state.setIn(['resources', action.url], Immutable.Map({
        readyState: 'error',
        error: action.error,
        data: null
      }));

    default:
      return state;
  }
}
