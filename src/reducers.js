const url = require('url')
    , { ApplicationState, APIRequest, APIResource, Route } = require('./records/state')
    , { createReducer } = require('redux-immutablejs')

const {
  REQUEST_API_RESOURCE,
  REQUEST_NAVIGATION,
} = require('./types').actions

const {
  PENDING,
  SUCCESS,
  FAILURE,
} = require('./types').readyStates

const PROJECT_REGEX = /^\/projects\/[^\/]+\//

module.exports = createReducer(new ApplicationState(), {
    [REQUEST_API_RESOURCE]: (state, action) => {
      let updated = state
        .setIn(['requests', action.requestID], new APIRequest(action))

      if (action.readyState === SUCCESS) {
        const uri = url.parse(action.url || action.responseData.get('url')).pathname

        const resource = new APIResource({
          url: uri,
          data: action.responseData,
          triples: action.responseTriples,
          updated: action.updated,
        })

        const path = uri === '/me/'
          ? ['user']
          : ['resources', uri]

        updated = updated.setIn(path, resource);
      }

      return updated;
    },

    [REQUEST_NAVIGATION]: (state, action) => {
      const projectURL = PROJECT_REGEX.exec(action.path)

      switch (action.readyState) {
        case PENDING:
        case FAILURE:
          return state
            .setIn(['application', 'next'], new Route(action))

        case SUCCESS:
          return state
            .setIn(['application', 'next'], null)
            .setIn(['application', 'current'], new Route(action))
            .setIn(['application', 'currentProjectURL'], projectURL && projectURL[0])

        default:
          throw Error('Invalid readyState');
      }
    },
});
