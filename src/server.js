"use strict";

/* eslint camelcase:0 */

var process = require('process')
  , http = require('http')
  , _ = require('underscore')
  , request = require('request')
  , cookie = require('cookie')
  , React = require('react')
  , Immutable = require('immutable')
  , Router = require('./router')
  , router = new Router()


const VERSION = require('../package.json').version
    , FETCH_ERROR = '__error__'
    , USER_DATA = '__AUTHENTICATED_USER__'


global.EditorsNotes = {};
global.EditorsNotes.jed = getJed();


function getJed() {
  var child_process = require('child_process')
    , Jed = require('jed')
    , path = require('path')
    , po2json = require('po2json')
    , localePath
    , files
    , data

  localePath = path.join(__dirname, '..', 'locale');

  files = child_process
    .execSync('find ' + localePath + ' -type f -name *po', { encoding: 'utf-8' })
    .trim()
    .split('\n');

  data = files.reduce(function (acc, file) {
    var domain = 'messages_' + path.basename(file).replace('.po', '')
      , poData = po2json.parseFileSync(file, { format: 'jed1.x', domain: domain })

    acc.locale_data[domain] = poData.locale_data[domain];
    return acc;
  }, { domain: 'messages_main', locale_data: {} });

  return new Jed(data);
}


function getSessionID(req) {
  return cookie.parse(req.headers.cookie || '').sessionid;
}


// fetchFn should __never__ return anything except 200. Anything else is an error.
const fetchFn = function (req, pathname, headers={}) {
  var sessionID = getSessionID(req)
    , url

  if (pathname[0] !== '/') throw Error('Can only fetch data relative to local API.');

  url = global.API_URL + pathname;

  if (sessionID) {
    headers.cookie = cookie.serialize('sessionid', sessionID);
  }

  headers.Host = req.headers.host;

  return new Promise((resolve, reject) => {
    request.get({ url, headers }, function (error, response, body) {
      if (error) {
        reject(error);
      } else if (response.statusCode === 200) {
        resolve(body);
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
  var bootstrapScript
    , jsBundleFilename
    , cssBundleFilename

  bootstrapScript = !bootstrap ? '' : `
    <script type="text/javascript">
      window.EDITORSNOTES_BOOTSTRAP = ${JSON.stringify(bootstrap)};
    </script>
  `

  jsBundleFilename = global.DEVELOPMENT_MODE ?
    'editorsnotes.js' :
    `editorsnotes-${VERSION}.min.js`

  cssBundleFilename = jsBundleFilename.replace(/.js$/, '.css');


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
    <script type="text/javascript" src="/static/${jsBundleFilename}"></script>
  </body>
</html>
`
}


router.add(require('./base_routes'))
router.add(require('./admin_routes'))


function render(props, bootstrap) {
  var Application = require('./components/application.jsx')
    , { renderToString } = require('react-dom/server')
    , application = React.createElement(Application, props)
    , html = makeHTML(renderToString(application), bootstrap)

  return html;
}


function logError(err) {
  process.stderr.write('ERROR\n==========\n');
  process.stderr.write((err.stack || err) + '\n');
  process.stderr.write('=========\n\n');

}


function getUserData(req) {
  var sessionID = getSessionID(req)

  if (!sessionID) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    var url = global.API_URL + '/me/'
      , headers = {}

    headers.cookie = cookie.serialize('sessionid', sessionID);
    headers.Accept = 'application/json';
    headers.Host = req.headers.host;


    request.get({ url, headers }, function (err, response, body) {
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


// Render view template, unless there is no template, in which case just
// render a blank page.
//
// FIXME: needs to be able to be cached better- maybe use
// React.renderToStaticMarkup if user is not logged in
router.fallbackHandler = function (matchName, path) {
  return function (config, params, queryParams) {
    var promise = Promise.resolve({})
      , bootstrap

    if (config.getData) {
      promise = promise
        .then(() => config.getData(
          fetchFn.bind(null, this.req),
          this.req.url,
          params,
          queryParams))
    }

    promise = promise
      .then(data => getUserData(this.req).then(userData => {
        if (userData) data[USER_DATA] = userData;

        return data;
      }))
      .then(data => (bootstrap = data))
      .then(data => {
        var immutableData = {};

        Object.keys(data).forEach(key => {
          immutableData[key] = Immutable.fromJS(data[key]);
        });

        return immutableData;
      })
      .then(props => {
        var hadError = props.data && props.data.has(FETCH_ERROR)
          , component = hadError ? require('./components/main/error/component.jsx') : config.Component

        return _.extend(props, {
          ActiveComponent: component,
          path
        })
      })
      .then(props => !config.getStore ? props :
          config.getStore(bootstrap)
            .then(store => Object.assign({}, props, { store })))
      .then(props => render(props, bootstrap))
      .then(html => {
        this.res.writeHead(200, { 'Content-Type': 'text/html' });
        this.res.end(html);
      });

    promise.catch(err => {
      let msg = '<h1>Server error</h1>';

      // FIXME Actually render within the framework of the site
      logError(err);

      this.res.writeHead(500);
      this.res.end(makeHTML(
        msg +
        `<iframe height=100% width=100% src="data:text/html;charset=utf-8,${encodeURI(err)}" />`))
    });
  }
}

module.exports = {
  makeHTML,

  serve: function (port, apiURL, developmentMode) {
    global.API_URL = apiURL;
    global.DEVELOPMENT_MODE = developmentMode;

    var server = http.createServer(function (req, res) {
      router.dispatch(req, res, function (err) {
        if (err) {

          getUserData(req)
            .then(userData => {
              var props = {}
                , data = {}

              if (userData) data[USER_DATA] = props[USER_DATA] = Immutable.fromJS(userData);
              props.ActiveComponent = require('./components/main/not_found/component.jsx');

              res.writeHead(404, { 'Content-Type': 'text/html' });

              res.end(render(props, data));
            })
            .catch(serverErr => {
              let msg = '<h1>Server error</h1>';

              logError(serverErr);

              res.writeHead(500);
              res.end(makeHTML(msg));
            })
        }
      });
    });

    server.listen(port);
    return server;
  }
}
