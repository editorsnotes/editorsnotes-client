"use strict";

/* eslint camelcase:0 */

const Jed = require('jed')
    , http = require('http')
    , path = require('path')
    , React = require('react')
    , cookie = require('cookie')
    , process = require('process')
    , request = require('request')
    , po2json = require('po2json')
    , Immutable = require('immutable')
    , { execSync } = require('child_process')
    , { createStore } = require('redux')
    , { renderToString } = require('react-dom/server')
    , parseLD = require('./utils/parse_ld')
    , Router = require('./router')


const VERSION = require('../package.json').version
    , FETCH_ERROR = '__error__'


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
  return function ({ name, Component, resource, makeTripleStore }, params, queryParams) {
    const userDataPromise = getUserData(this.req)

    let resourceDataPromise = Promise.resolve();
    let resourceURL = null;

    if (resource) {
      resourceURL = resource(requestedPath);

      resourceDataPromise = resourceDataPromise
        .then(() => fetchJSON(this.req, resourceURL, params, queryParams))
        .then(data => ({ [resourceURL]: data }))
    }

    Promise.all([userDataPromise, resourceDataPromise])
      .then(([user, resources]) => {
        if (resourceURL && makeTripleStore) {
          return parseLD(resources[resourceURL]).then(tripleStore => ({
            tripleStore, user, resources
          }));
        }

        return { tripleStore: null, user, resources }
      })
      .then(({ tripleStore, user, resources }) =>
        render(Component, Immutable.Map({
          jed,
          tripleStore,

          currentPath: requestedPath,
          currentAPIPath: resourceURL,

          user: Immutable.fromJS(user),
          resources: Immutable.fromJS(resources)
        }))
      )
      .then(html => {
        this.res.writeHead(200, { 'Content-Type': 'text/html' });
        this.res.end(html);
      })
      .catch(err => {
        logError(err);

        renderError(userDataPromise, err).then(html => {
          this.res.writeHead(200, { 'Content-Type': 'text/html' });
          this.res.end(html);
        })
      })
  }
}

      /*
      .then(props => {
        var hadError = props.data && props.data.has(FETCH_ERROR)
          , component = hadError ? require('./components/main/error/component.jsx') : config.Component

        return _.extend(props, {
          ActiveComponent: component,
          path
        })
      })
*/


function getSessionID(req) {
  return cookie.parse(req.headers.cookie || '').sessionid;
}


// fetchFn should __never__ return anything except 200. Anything else is an error.
function fetchJSON(req, pathname, headers={}) {
  if (pathname[0] !== '/') throw Error('Can only fetch data relative to local API.');

  const url = global.API_URL + pathname;

  const sessionID = getSessionID(req)
  if (sessionID) {
    headers.cookie = cookie.serialize('sessionid', sessionID);
  }

  headers.Host = req.headers.host;
  headers.Accept = 'application/ld+json';

  return new Promise((resolve, reject) => {
    request.get({ url, headers }, (error, response, body) => {
      if (error) {
        reject(error);
      } else if (response.statusCode === 200) {
        // FIXME: may not return JSON?
        resolve(JSON.parse(body));
      } else {
        let errorMessage
          , message

        errorMessage = 'Request resulted in non-200 status code\n. Request content:';
        errorMessage += JSON.stringify(response, true, ' ');

        logError(errorMessage);

        try {
          message = JSON.parse(body).detail;
          resolve(JSON.stringify({
            [FETCH_ERROR]: {
              message,
              statusCode: response.statusCode
            }
          }));
        } catch (e) {
          reject(body);
        }

      }
    });
  });
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
  </body>
</html>
`
}


function render(Component, initialState) {
  const Application = require('./components/application.jsx')
      , store = createStore(state => state, initialState)

  const bootstrap = initialState
    .filter((val, key) => key !== 'jed' && key !== 'tripleStore')

  return makeHTML(renderToString(React.createElement(Application, {
    store,
    ActiveComponent: Component
  })), bootstrap);
}


function renderError(userDataPromise, error) {
  const ErrorComponent = require('./components/main/error/component.jsx')

  return new Promise(resolve => {
    userDataPromise
      .then(user => resolve(render(ErrorComponent, Immutable.fromJS({
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


function getUserData(req) {
  const sessionID = getSessionID(req)

  if (!sessionID) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const url = global.API_URL + '/me/'
        , headers = {}

    headers.cookie = cookie.serialize('sessionid', sessionID);
    headers.Accept = 'application/json';
    headers.Host = req.headers.host;

    request.get({ url, headers }, (err, response, body) => {
      // TODO: Maybe, if status code is 403, invalidate the sessionid cookie?
      if (err) {
        reject(err);
        return;
      }

      if (response.statusCode === 200) {
        resolve(JSON.parse(body));
      }

      resolve(null);
    });
  })
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
          renderError(getUserData(req), err).then(html => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
          })
        }
      })
    });

    server.listen(port);
    return server;
  }
}
