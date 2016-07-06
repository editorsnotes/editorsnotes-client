"use strict";

require('whatwg-fetch');

const Immutable = require('immutable')
    , React = require('react')
    , { render } = require('react-dom')
    , { createStore, applyMiddleware, compose } = require('redux')
    , thunk = require('redux-thunk').default

const rootReducer = require('./reducers')
    , Root = require('./components/root.jsx')

window.onload = initialize;

function initialize() {
  const store = createStore(
    rootReducer,
    getInitialState(),
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? window.devToolsExtension() : undefined
    )
  )

  render(<Root store={store} />, document.body.querySelector('#react-app'))
}

function getInitialState() {
  const bootstrap = window.EDITORSNOTES_BOOTSTRAP
      , { ApplicationState } = require('./records/state')

  let state = new ApplicationState({ jed: require('./jed')() });

  if (bootstrap) {
    state = state.merge(Immutable.fromJS(bootstrap));
  }

  return state
}
