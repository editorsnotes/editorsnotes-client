"use strict";

require('isomorphic-fetch')

const http = require('http')
    , React = require('react')
    , Immutable = require('immutable')
    , thunk = require('redux-thunk').default
    , { createStore, applyMiddleware } = require('redux')
    , { Provider } = require('react-redux')
    , { renderToString } = require('react-dom/server')

const Router = require('./router')
    , rootReducer = require('./reducers')
    , Root = require('./components/root.jsx')
    , Application = require('./components/application.jsx')
    , { navigateToPath } = require('./actions')
    , { version } = require('../package.json')
    , { ApplicationState } = require('./records/state')


function render(html, renderClient=true) {
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
    ${html}
    ${!renderClient ? '' : `<script src="/static/${jsFilename}" type="text/javascript"></script>`}
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
        , initialState = new ApplicationState({ jed })

    const server = http.createServer((req, res) => {
      const start = new Date();
      const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
      )

      store.dispatch(navigateToPath(router, req.url, req))
        .promise
        .then(() => {
          let bodyHTML

          let msg = `[${start.toDateString()} ${start.toLocaleTimeString()}] GET ${req.url}`

          try {
            const applicationHTML = renderToString(<Root store={store} />)

            const bootstrap = store
              .getState()
              .toMap()
              .filter((val, key) => key !== 'jed')

            bodyHTML = `
    <div id="react-app" style="height: 100%">${applicationHTML}</div>
    <script type="text/javascript">
      window.EDITORSNOTES_BOOTSTRAP = ${JSON.stringify(bootstrap, true, '  ')};
    </script>
            `

            msg += ' (200 OK) '
          } catch (e) {
            const fakeStore = createStore(() => Immutable.Map(), Immutable.Map())

            const ErrorComponent = () => (
              <div>
                <h1>Server error</h1>
                <pre className="p2">{ e.stack }</pre>

                <h2>Store state</h2>
                <pre className="p2">
                {JSON.stringify(store.getState().set('jed', '(omitted)'), true, '  ')}
                </pre>
              </div>
            )

            const fakeRouter = {
              match: () => ({
                handler: {
                  Component: ErrorComponent
                }
              })
            }

            bodyHTML = renderToString(
              <Provider store={fakeStore}>
                <Application router={fakeRouter} />
              </Provider>
            )

            msg += ' (500 ERROR) '
            process.stderr.write(e.stack + '\n');
          }
          const html = render(bodyHTML);

          msg += `${bodyHTML.length} ${new Date().getTime() - start.getTime()}ms\n`;

          process.stdout.write(msg);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(html);
        })
        .catch(err => {
          // It should never get here, right?
          throw err;
        })
    });

    server.listen(port);
    return server;
  }
}
