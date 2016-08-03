"use strict";

const React = require('react')
    , { Provider } = require('react-redux')
    , Application = require('./application.jsx')
    , Router = require('../router')

const Root = ({ store }) =>
  <Provider store={store}>
    <Application router={new Router()} />
  </Provider>

Root.propTypes = {
  store: React.PropTypes.object.isRequired
}

module.exports = Root;
