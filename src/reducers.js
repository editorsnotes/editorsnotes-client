const { Store, Resource, Route } = require('./records/state')

module.exports = function rootReducer(state=(new Store()), action) {
  let updatedState

  switch (action.type) {
    case 'REQUEST_API_RESOURCE':
      return state.setIn(['resources', action.url], new Resource({
        readyState: 'loading',
        error: null,
        data: null
      }));

    case 'RECEIVE_API_RESOURCE':
      updatedState = state.setIn(['resources', action.url], new Resource({
        readyState: 'success',
        error: null,
        data: action.data,
        triples: action.triples || null
      }))

      return action.url !== '/me/'
        ? updatedState
        : updatedState.set('user', updatedState.getIn(['resources', '/me/', 'data']))

    case 'ERRORED_API_RESOURCE':
      throw new Error('not implemented yet');
      /*
      return state.setIn(['resources', action.url], new Resource({
        readyState: 'error',
        error: action.error,
        data: null
      }));
      */

    case 'NAVIGATION_REQUEST':
      return state
        .setIn(['application', 'next'], new Route({
          path: action.path,
          readyState: 'loading',
        }));

    case 'NAVIGATION_SUCCESS':
      return state
        .deleteIn(['application', 'next'])
        .setIn(['application', 'current'], new Route({
          path: action.path,
          APIPath: action.APIPath,
          readyState: 'success',
        }));

    case 'NAVIGATION_ERROR':
      throw new Error('not implemented yet');
      /*
      return state.set('currentPage', Immutable.Map({
        name: action.name,
        readyState: 'error',
        error: action.error
      }));
      */

    default:
      return state;
  }
}
