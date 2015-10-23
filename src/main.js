"use strict";

var _ = require('underscore')
  , EventEmitter = require('events')
  , Immutable = require('immutable')
  , React = require('react')
  , Router = require('./router')
  , router


/* Polyfills */
require('whatwg-fetch');


/* Globals */
window.EditorsNotes = {};
window.EditorsNotes.jed = require('./jed');
window.EditorsNotes.events = new EventEmitter();


/* Function that will render the whole application */
function render(props) {
  var Application = require('./components/application.jsx')
    , el = document.body.querySelector('#react-app')

  return React.render(<Application {...props} />, el);
}


/* Router */
router = new Router();

// TODO: Only add admin_routes if user is logged in?
router.add(require('./base_routes'));
router.add(require('./admin_routes'));

router.fallbackHandler = function () {
  return function (config, params, queryParams) {
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
      .then(props => _.extend(props, { ActiveComponent: config.Component }))
      .then(render)
  }
}

/* Render the react application when DOM is ready */
window.onload = function () {
  router.execute(window.location.pathname);
}