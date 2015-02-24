var $ = require('jquery')
  , Router = require('./router')
  , router = new Router()
  , currentView = null

//require('./compiled_templates');

function switchView(view) {
  if (currentView) currentView.remove();
  currentView = view;
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

    view = new config.View(opts, { prerendered: renderedOnServer });
    switchView(view);
  }
}

$(document).ready(function () {
  router.execute(window.location.pathname);
});

module.exports = router;
