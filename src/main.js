"use strict";

require('whatwg-fetch');

const Immutable = require('immutable')
    , React = require('react')
    , { createStore } = require('redux')
    , Router = require('./router')

window.onload = initialize;

const ClientRouter = React.createClass({
  componentWillMount() {
    const router = new Router(this.generateRouteHandler)

    router.add(require('./base_routes'));
    router.add(require('./admin_routes'));

    router.execute(window.location.pathname);
  },

  generateRouteHandler(matchName, requestedPath) {
    return ({ Component, componentProps }, params, queryParams) => {
      this.setState({
        ActiveComponent: Component,
        activeComponentProps: componentProps
          ? componentProps(requestedPath, queryParams)
          : {}
      })
    }
  },

  render() {
    const Application = require('./components/application.jsx')
        , { ActiveComponent, componentProps } = this.state

    return (
      <Application>
        <ActiveComponent {...componentProps} />
      </Application>
    )
  }
})

function initialize() {
  const { Provider } = require('react-redux')
    , { render } = require('react-dom')

  getInitialState().then(initialState => {
    const store = createStore(
      state => state,
      initialState,
      window.devToolsExtension ? window.devToolsExtension() : undefined
    )

    const tree = (
      <Provider store={store}>
        <ClientRouter />
      </Provider>
    )

    render(tree, document.body.querySelector('#react-app'))
  });
}

function getInitialState() {
  const bootstrap = window.EDITORSNOTES_BOOTSTRAP
      , ProgramState = require('./records/state')
      , parseLD = require('./utils/parse_ld')

  let state = new ProgramState();

  if (bootstrap) {
    state = state.merge(
      Immutable.fromJS(bootstrap).delete('makeTripleStoreOnRender')
    );
  }

  state = state.set('jed', require('./jed'))

  return !bootstrap.makeTripleStoreOnRender
    ? Promise.resolve(state)
    : parseLD(bootstrap.resources[bootstrap.currentAPIPath])
        .then(tripleStore => state.set('tripleStore', tripleStore))
}
