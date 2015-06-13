"use strict";

var process = require('process')
  , http = require('http')
  , _ = require('underscore')
  , request = require('request')
  , React = require('react')
  , Immutable = require('immutable')
  , Router = require('../router')
  , jed = require('./jed')
  , router = new Router()


const API_URL = process.env.EDITORSNOTES_API_URL || 'http://localhost:8001'
    , SERVER_PORT = process.env.EDITORSNOTES_CLIENT_PORT || 8450

const fetchFn = function (req, pathname, headers={}) {
  var url
    , authorization

  if (pathname[0] !== '/') throw Error('Can only fetch data relative to local API.');

  url = API_URL + pathname;

  // Set authorization token from cookie if present
  authorization = getAuthorizationHeader(req);
  if (authorization) {
    headers.Authorization = authorization;
  }

  headers.Host = req.headers.host;

  return new Promise((resolve, reject) => {
    request.get({ url, headers }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject([error, response]);
      }
    });
  })
}

function getAuthorizationHeader(req) {
  var cookies = require('cookie').parse(req.headers.cookie || '')
    , auth = null

  if (cookies.token) {
    auth = 'Token ' + cookies.token;
  }

  return auth;
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
  </head>

  <body>
    ${body}
    ${bootstrapScript}
    <script type="text/javascript" src="/static/bundle.js"></script>
  </body>
</html>
`
}

//router.add(require('../admin_views/routes'))
router.add(require('../base_routes'))

function render(props, bootstrap) {
  var Application = require('../components/application')
    , application = React.createElement(Application, props)
    , html = makeHTML(React.renderToString(application), bootstrap)

  return html;
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
        .then(data => (bootstrap = data))
        .then(data => {
          var immutableData = {};

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
      .then(props => render(props, bootstrap))
      .then(html => {
        this.res.writeHead(200, { 'Content-Type': 'text/html' });
        this.res.end(html);
      });

    promise.catch(err => {
      let msg = '<h1>Server error</h1>';

      process.stderr.write('ERROR\n==========\n');
      process.stderr.write(err.stack + '\n');
      process.stderr.write('=========\n\n');

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
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(render({ ActiveComponent: require('../components/not_found.jsx') }))
        }
      });
    });

    server.listen(SERVER_PORT);
    return server;
  }
}
