const { ApplicationState, APIRequest, Route } = require('./records/state')
    , { createReducer } = require('redux-immutablejs')

const {
  REQUEST_API_RESOURCE,
  REQUEST_NAVIGATION,
} = require('./types/actions')

const {
  PENDING,
  SUCCESS,
  FAILURE,
} = require('./types/readyStates')

module.exports = createReducer(new ApplicationState(), {
    [REQUEST_API_RESOURCE]: (state, action) => {
      return state.setIn(['resources', action.url], new APIRequest(action))
    },

    [REQUEST_NAVIGATION]: (state, action) => {
      switch (action.readyState) {
        case PENDING:
        case FAILURE:
          return state
            .setIn(['application', 'next'], new Route(action))

        case SUCCESS:
          return state
            .setIn(['application', 'next'], null)
            .setIn(['application', 'current'], new Route(action))

        default:
          throw Error('Invalid readyState');
      }
    },
});
