"use strict";

var process = require('process')
  , http = require('http')
  , request = require('request')
  , React = require('react')
  , Router = require('../router')
  , router = new Router()


const API_URL = process.env.EDITORSNOTES_API_URL || 'http://localhost:8001'
    , SERVER_PORT = process.env.EDITORSNOTES_CLIENT_PORT || 8450

function makeHTML(body) {
  return `<!doctype html>
<html lang="en">
  <head>
    <title>Editors' Notes</title>
    <meta charset="utf-8"/>

    <link rel="stylesheet" href="/static/style.css" />
    <script type="text/javascript" src="/static/bundle.js"></script>
  </head>

  <body>
    ${body}
  </body>
</html>
`
}

//router.add(require('../admin_views/routes'))
router.add(require('../base_routes'))


function getFetchOpts(req) {
  var cookies = require('cookie').parse(req.headers.cookie || '')
    , options

  options = {
    baseUrl: API_URL,
    headers: {
      Host: req.headers.host,
      Accept: 'application/json'
    }
  }

  if (cookies.token) {
    options.headers.Authorization = 'Token ' + cookies.token;
  }

  return options;
}

router.fallbackHandler = function () {
  // Render view template, unless there is no template, in which case just
  // render a blank page.
  return function (config, params, queryParams) {
    var url
      , options

    if (config.fetch) {
      options = getFetchOpts(this.req);
      if (config.fetch === true) {
        url = this.req.url;
      } else if (config.fetch === 'model') {
        url = (new config.Model(params)).url();
      }
      request(url, options, (err, resp, body) => {
        var data
          , breadcrumb

        if (err) {
          process.stderr.write('ERROR\n==========\n');
          process.stderr.write(options + '\n');
          process.stderr.write(err + '\n');
          process.stderr.write('=========\n\n');
          this.res.writeHead(500);
          this.res.end('<h1>Server error: ' + this.res.statusCode + '</h1>')// + body)
        } else {
          if (resp.statusCode === 200) {
            this.res.writeHead(200, { 'Content-Type': 'text/html' });
            try {
              data = JSON.parse(body);

              if (config.View.prototype.getBreadcrumb) {
                breadcrumb = config.View.prototype.getBreadcrumb(data);
              }

              // FIXME
              this.res.end(env.render(template, {
                server: true,
                bootstrap: body,
                data: data,
                breadcrumb: breadcrumb
              }));

            } catch (e) {
              this.res.end(
                '<h1>Rendering error</h1>' +
                '<p>' + e + '</p>' +
                '<h2>Stack</h2>' +
                '<pre>' + e.stack + '</pre>')
            }
          } else {
            this.res.end('<h1>Server error: ' + this.res.statusCode + '</h1>')// + body);
          }
        }
      });
    } else {
      let Application = require('../components/application.jsx')
        , body = React.renderToString(React.createElement(Application))

      this.res.writeHead(200, { 'Content-Type': 'text/html' });
      this.res.end(makeHTML(body));
      this.res.end(React.renderToString(React.createElement(Application)));
    }
  }
}

module.exports = {
  serve: function () {
    var server = http.createServer(function (req, res) {
      router.dispatch(req, res, function (err) {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(makeHTML('<h1>404</h1><p>' + err + '</p>'));
        }
      });
    });

    server.listen(SERVER_PORT);
    return server;
  }
}
