var $ = require('jquery')
  , cookie = require('cookie-cutter')
  , Router = require('./router')
  , env = require('./nunjucks/env')
  , router = new Router()
  , currentView = null

function switchView(view) {
  if (currentView) currentView.remove();
  currentView = view;
}

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

router.fallbackHandler = function () {
  return function(config, params, queryParams) {
    var renderedOnServer = EditorsNotes.hasOwnProperty('renderedOnServer')
      , bootstrap = EditorsNotes.bootstrap
      , opts = { el: '#main' }

    delete EditorsNotes.renderedOnServer;

    if (config.Model) {
      opts.model = new config.Model(bootstrap || params);
    } else if (config.Collection) {
      // FIXME
      opts.collection = new config.Collection();
    }

    switchView(new config.View(opts, { prerendered: renderedOnServer }));
  }
}

$(document).ready(function () {
  initLogin();
  router.execute(window.location.pathname);
});

module.exports = router;
