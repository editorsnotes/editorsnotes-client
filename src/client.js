"use strict";

var _ = require('underscore')
  , Immutable = require('immutable')
  , React = require('react')
  , Router = require('./router')
  , router = new Router()
  , jed = require('./jed')

/*
function initLogin() {
  var user = localStorage.userInfo
    , authCookie = cookie.get('token')
    , $authSignedOut = $('#auth-menu-signed-out')
    , $authSignedIn = $('#auth-menu-signed-in')

  if (user && authCookie) {
    user = JSON.parse(user);
    $authSignedOut.hide();
    $authSignedIn.show().find('a')
      .attr('href', user.url)
      .text(user.display_name)
  } else {
    delete localStorage.userInfo;
    cookie.set('token', '', { expires: new Date(0) });

    $authSignedOut.show();
    $authSignedIn.hide();
  }

}
*/

function render(props) {
  var Application = require('./components/application.jsx')
    , el = document.body.querySelector('#react-app')

  return React.render(<Application {...props} />, el);
}
router.fallbackHandler = function () {
  return function(config, params, queryParams) {
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
      .then(props => _.extend(props, {
        ActiveComponent: config.Component,
        i18n: jed
      }))
      .then(render)
  }
}

window.onload = function () {
  router.execute(window.location.pathname);
}

module.exports = router;
