"use strict";

require('isomorphic-fetch')

const http = require('http')
    , React = require('react')
    , thunk = require('redux-thunk').default
    , { createStore, applyMiddleware } = require('redux')
    , { renderToString } = require('react-dom/server')

const Router = require('./router')
    , rootReducer = require('./reducers')
    , Root = require('./components/root.jsx')
    , { navigateToPath } = require('./actions')
    , { version } = require('../package.json')
    , { Store } = require('./records/state')


function render(store) {
  const body = renderToString(<Root store={store} />)

  const bootstrap = store
    .getState()
    .toMap()
    .filter((val, key) => key !== 'jed')

  const bootstrapScript = `
    <script type="text/javascript">
      window.EDITORSNOTES_BOOTSTRAP = ${JSON.stringify(bootstrap, true, '  ')};
    </script>
  `

  const jsFilename = global.DEVELOPMENT_MODE ?
    'editorsnotes.js' :
    `editorsnotes-${version}.min.js`

  const cssFilename = jsFilename.replace(/.js$/, '.css')

  return `<!doctype html>
<html lang="en">
  <head>
    <title>Editors' Notes</title>
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="/static/${cssFilename}" />
  </head>

  <body>
    <div id="react-app" style="height: 100%">${body}</div>
    ${bootstrapScript}
    <script src="/static/${jsFilename}" type="text/javascript"></script>
  </body>
</html>
`
}

module.exports = {
  serve(port, apiURL, developmentMode) {
    global.API_URL = apiURL;
    global.DEVELOPMENT_MODE = developmentMode;

    const jed = require('./jed')()
        , router = new Router()
        , initialState = new Store({ jed })

    const server = http.createServer((req, res) => {
      const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
      )

      store.dispatch(navigateToPath(router, req.url, req))
        .then(() => {
          let html

          try {
            html = render(store);
          } catch (e) {
            html = `<!doctype html><html><h1>Server error</h1><pre>${e.stack}</pre></html>`
          }

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(html);
        })
        .catch(err => {
          // It should never get here, right?
          throw err;
        });
    });

    server.listen(port);
    return server;
  }
}
