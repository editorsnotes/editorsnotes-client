"use strict";

/* eslint camelcase:0 */

const Jed = require('jed')
    , http = require('http')
    , path = require('path')
    , React = require('react')
    , thunk = require('redux-thunk').default
    , cookie = require('cookie')
    , po2json = require('po2json')
    , Immutable = require('immutable')
    , { execSync } = require('child_process')
    , { createStore, applyMiddleware } = require('redux')
    , { renderToString } = require('react-dom/server')

const rootReducer = require('./reducers')
    , Router = require('./router')
    , Store = require('./records/state')
    , { fetchAPIResource, fetchUser } = require('./actions')

const VERSION = require('../package.json').version

require('isomorphic-fetch')


const jed = (() => {
  const localePath = path.join(__dirname, '..', 'locale');

  const files = (
    execSync('find ' + localePath + ' -type f -name *po', { encoding: 'utf-8' })
    .trim()
    .split('\n'));

  const data = files.reduce((acc, file) => {
    const domain = 'messages_' + path.basename(file).replace('.po', '')
        , poData = po2json.parseFileSync(file, { format: 'jed1.x', domain })

    acc.locale_data[domain] = poData.locale_data[domain];
    return acc;
  }, { domain: 'messages_main', locale_data: {} });

  return new Jed(data);
})()


// Render view template, unless there is no template, in which case just
// render a blank page.
//
// FIXME: needs to be able to be cached better- maybe use
// React.renderToStaticMarkup if user is not logged in
function generateRouteHandler(matchName, requestedPath) {
  return function ({ name, Component, componentProps, resource, makeTripleStore }, params, queryParams) {
    const headers = { Host: this.req.headers.host }
        , sessionID = getSessionID(this.req)
        , resourceURL = resource ? resource(requestedPath) : null;

    let initialState = new Store({
      jed,
      currentPath: requestedPath,
    })

    if (resourceURL) {
      initialState = initialState.set('currentAPIPath', resourceURL);
    }

    const store = createStore(
      rootReducer,
      initialState,
      applyMiddleware(thunk)
    )

    // FIXME, deal with these here?
    queryParams;

    if (sessionID) {
      headers.cookie = cookie.serialize('sessionid', sessionID);
    }

    const promises = [ store.dispatch(fetchUser(headers)) ]

    if (resourceURL) {
      promises.push(
        store.dispatch(fetchAPIResource(
          resourceURL,
          headers,
          makeTripleStore
        ))
      );
    }

    Promise.all(promises)
      .then(() => {
        const props = componentProps && componentProps(requestedPath)
            , html = render(Component, props, store)

        this.res.writeHead(200, { 'Content-Type': 'text/html' });
        this.res.end(html);
      })
      .catch(err => {
        logError(err);
        this.res.writeHead(200, { 'Content-Type': 'text/html' });
        this.res.end(err.stack || err);
      })
  }
}

function getSessionID(req) {
  return cookie.parse(req.headers.cookie || '').sessionid;
}


function makeHTML(body, bootstrap) {
  const bootstrapScript = !bootstrap ? '' : `
    <script type="text/javascript">
      window.EDITORSNOTES_BOOTSTRAP = ${JSON.stringify(bootstrap, true, '  ')};
    </script>
  `

  const jsBundleFilename = global.DEVELOPMENT_MODE ?
    'editorsnotes.js' :
    `editorsnotes-${VERSION}.min.js`

  const cssBundleFilename = jsBundleFilename.replace(/.js$/, '.css');


  return `<!doctype html>
<html lang="en">
  <head>
    <title>Editors' Notes</title>
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="/static/${cssBundleFilename}" />
  </head>

  <body>
    <div id="react-app" style="height: 100%">${body}</div>
    ${bootstrapScript}
    <script src="/static/${jsBundleFilename}" type="text/javascript"></script>
  </body>
</html>
`
}

function render(Component, componentProps={}, store) {
  const { Provider } = require('react-redux')
      , Application = require('./components/application.jsx')

  const bootstrap = store
    .getState()
    .toMap()
    .filter((val, key) => key !== 'jed')

  const application = (
    <Provider store={store}>
      <Application>
        <Component {...componentProps} />
      </Application>
    </Provider>
  )

  return makeHTML(renderToString(application), bootstrap);
}


function renderError(userDataPromise, error) {
  const ErrorComponent = require('./components/main/error/component.jsx')

  return new Promise(resolve => {
    userDataPromise
      .then(user => resolve(render(ErrorComponent, null, Immutable.fromJS({
        user,
        serverRenderError: global.DEVELOPMENT_MODE
          ? error.stack
          : error
      }))))
      .catch(err => resolve(
        `<h1>Server error</h1>
        <iframe
            height=100%
            width=100%
            src="data:text/html;charset=utf-8,${encodeURI(err)}" />`))
  });
}


function logError(err) {
  process.stderr.write('ERROR\n==========\n');
  process.stderr.write((err.stack || err) + '\n');
  process.stderr.write('=========\n\n');

}


module.exports = {
  makeHTML,

  serve(port, apiURL, developmentMode) {
    global.API_URL = apiURL;
    global.DEVELOPMENT_MODE = developmentMode;

    const router = new Router(generateRouteHandler);

    router.add(require('./base_routes'));
    router.add(require('./admin_routes'));

    const server = http.createServer((req, res) => {
      router.dispatch(req, res, (err) => {
        if (err) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(err.stack || err);
        }
      })
    });

    server.listen(port);
    return server;
  }
}
