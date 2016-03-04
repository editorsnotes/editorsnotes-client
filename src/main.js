"use strict";

var _ = require('underscore')
  , EventEmitter = require('events')
  , Immutable = require('immutable')
  , React = require('react')
  , Router = require('./router')
  , remoteServers
  , currentRemoteServer
  , router


/* Polyfills */
require('whatwg-fetch');


/* Globals */
window.EditorsNotes = {};
window.EditorsNotes.clientRendered = !window.EDITORSNOTES_SERVER_RENDERED;
window.EditorsNotes.jed = require('./jed');
window.EditorsNotes.events = new EventEmitter();


if (window.EditorsNotes.clientRendered) {
  try {
    remoteServers = JSON.parse(localStorage.EN_REMOTE_SERVERS);
    window.EditorsNotes.remoteServers = (
      Object.keys(remoteServers)
        .map(key => {
          var [ domain, token ] = atob(key).split('|')
            , created = remoteServers[key]

          return { key, domain, token, created }
        }))
  } catch (e) {
    localStorage.EN_REMOTE_SERVERS = '{}';
    window.EditorsNotes.remoteServers = {};
  }

  try {
    if (localStorage.currentRemoteServer) {
      let key = localStorage.currentRemoteServer
        , [ domain, token ] = atob(key).split('|')
        , created = remoteServers[key]

      if (domain && token && created) {
        currentRemoteServer = { key, domain, token, created };
      }
    }
  } catch (e) {
    currentRemoteServer = null;
  }
}

window.EditorsNotes.currentRemoteServer = currentRemoteServer || null;


/* Function that will render the whole application */
function renderApplication(props) {
  var Application = require('./components/application.jsx')
    , { render } = require('react-dom')

  return render(
      React.createElement(Application, props),
      document.body.querySelector('#react-app'))
}


function handleRoute(path, config, params, queryParams) {
  var promise = Promise.resolve({})

  if (window.EDITORSNOTES_BOOTSTRAP) {
    promise = promise
      .then(() => {
        var data = window.EDITORSNOTES_BOOTSTRAP
          , immutableData = {}

        Object.keys(data).forEach(key => {
          immutableData[key] = Immutable.fromJS(data[key]);
        });

        return immutableData;
      });
  }

  promise = promise
    .then(props => _.extend(props, { ActiveComponent: config.Component, path }))
    .then(renderApplication)
}

// TODO: Only add admin_routes if user is logged in?
router = new Router([
  require('./base_routes'),
  require('./admin_routes')
], handleRoute);


/* Render the react application when DOM is ready */
window.onload = function () {
  var { clientRendered } = window.EditorsNotes
    , path

  path = clientRendered ?
    '/' + window.location.hash.slice(1) :
    window.location.pathname;

  router.execute(path);
}
