"use strict";

var process = require('process')
  , http = require('http')
  , Router = require('../router')
  , router = new Router()
  , jed = require('./jed')
  , env


const API_URL = process.env.EDITORSNOTES_API_URL || 'http://localhost:8001'
    , SERVER_PORT = process.env.EDITORSNOTES_CLIENT_PORT || 8450


router.add(require('../admin_views/routes'))
router.add(require('../base_views/routes'))


env = require('../nunjucks/env')(router, jed)

/*
 * TODO: need to figure out how to deal with permissions for pages that don't
 * require fetching (i.e. adding things)
 */

router.fallbackHandler = function () {
  // Render view template, unless there is no template, in which case just
  // render a blank page.
  return function (config, params, queryParams) {
    var template = config.View.prototype.template || 'base.html'
      , cookies = require('cookie').parse(this.req.headers.cookie || '')
      , options = { headers: {}}

    if (config.View.prototype.fetch) {
      options.headers.Host = this.req.headers.host;
      options.headers.Accept = 'application/json';

      if (cookies.token) {
        options.headers.Authorization = 'Token ' + cookies.token;
      }
      config.View.prototype.fetch(options)
        .then(([data, resp, req]) => {
          if (resp.statusCode === 200) {
            this.res.writeHead(200, { 'Content-Type': 'text/html' });
            try {
              this.end(env.render(template, {
                server: true,
                bootstrap: data,
                data: JSON.parse(data)
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
        }, ([err, req]) => {
          process.stderr.write('ERROR\n==========');
          process.stderr.write(err);
          process.stderr.write('=========');
          this.res.writeHead(500);
          this.res.end('<h1>Server error: ' + this.res.statusCode + '</h1>')// + body)
        })
    } else {
      this.res.writeHead(200, { 'Content-Type': 'text/html' });
      this.res.end(env.render(template, { server: true }));
    }
  }
}

module.exports = {
  serve: function () {
    var server = http.createServer(function (req, res) {
      router.dispatch(req, res, function (err) {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(env.render('404.html', { message: err }));
        }
      });
    });

    server.listen(SERVER_PORT);
    return server;
  }
}
