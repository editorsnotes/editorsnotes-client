"use strict";

var process = require('process')
  , http = require('http')
  , _ = require('underscore')
  , request = require('request')
  , cookie = require('cookie')
  , React = require('react')
  , Immutable = require('immutable')
  , Router = require('../router')
  , router = new Router()


const API_URL = process.env.EDITORSNOTES_API_URL || 'http://localhost:8001'
    , SERVER_PORT = process.env.EDITORSNOTES_CLIENT_PORT || 8450

const FETCH_ERROR = '__error__'
    , USER_DATA = '__AUTHENTICATED_USER__'

function getSessionID(req) {
  return cookie.parse(req.headers.cookie || '').sessionid;
}


// fetchFn should __never__ return anything except 200. Anything else is an error.
const fetchFn = function (req, pathname, headers={}) {
  var sessionID = getSessionID(req)
    , url

  if (pathname[0] !== '/') throw Error('Can only fetch data relative to local API.');

  url = API_URL + pathname;

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
        let msg

        msg = 'Request resulted in non-200 status code\n. Request content:';
        msg += JSON.stringify(response, true, ' ');

        logError(msg);

        resolve(JSON.stringify({
          [FETCH_ERROR]: {
            statusCode: response.statusCode,
            message: JSON.parse(body).detail
          }
        }));
      }
    });
  });
}


function makeHTML(body, bootstrap) {
  var bootstrapScript = !bootstrap ? '' : `
    <script type="text/javascript">
      window.EDITORSNOTES_BOOTSTRAP = ${JSON.stringify(bootstrap)};
    </script>
  `
  return `<!doctype html>
<html lang="en">
  <head>
    <title>Editors' Notes</title>
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="/static/style.css" />
    <link rel="stylesheet" href="/static/codemirror.css" />
  </head>

  <body>
    <div id="react-app" style="height: 100%">${body}</div>
    ${bootstrapScript}
    <script type="text/javascript" src="/static/bundle.js"></script>
  </body>
</html>
`
}

//router.add(require('../admin_views/routes'))
router.add(require('../base_routes'))
router.add(require('../admin_routes'))

function render(props, bootstrap) {
  var Application = require('../components/application')
    , application = React.createElement(Application, props)
    , html = makeHTML(React.renderToString(application), bootstrap)

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
    var url = API_URL + '/me/'
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
router.fallbackHandler = function () {
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
          , component = hadError ? require('../components/error.jsx') : config.Component

        return _.extend(props, {
          ActiveComponent: component
        })
      })
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
      this.res.end(makeHTML(msg));
    });
  }
}

module.exports = {
  serve: function () {
    var server = http.createServer(function (req, res) {
      router.dispatch(req, res, function (err) {
        if (err) {

          getUserData(req)
            .then(userData => {
              var props = {}
                , data = {}

              if (userData) data[USER_DATA] = props[USER_DATA] = Immutable.fromJS(userData);
              props.ActiveComponent = require('../components/not_found.jsx');

              res.writeHead(404, { 'Content-Type': 'text/html' });

              res.end(render(props, data));
            })
            .catch(err => {
              let msg = '<h1>Server error</h1>';

              logError(err);

              res.writeHead(500);
              res.end(makeHTML(msg));
            })
        }
      });
    });

    server.listen(SERVER_PORT);
    return server;
  }
}
