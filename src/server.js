"use strict";

require('babel/register')({
  only: /src/
});


var http = require('http')
  , request = require('request')
  , Router = require('./router')
  , router = new Router()
  , server
  , env


const API_URL = process.env.EDITORSNOTES_API_URL || 'http://localhost:8001'
    , SERVER_PORT = process.env.EDITORSNOTES_CLIENT_PORT || 8450


router.add(require('./admin_views/routes'))
router.add(require('./base_views/routes'))


function getJed() {
  var child_process = require('child_process')
    , Jed = require('jed')
    , path = require('path')
    , po2json = require('po2json')
    , files
    , data

  files = child_process
    .execSync('find ../locale -type f -name *po', { encoding: 'utf-8' })
    .trim()
    .split('\n');

  data = files.reduce(function (acc, file) {
    var domain = 'messages_' + path.basename(file).replace('.po', '')
      , poData = po2json.parseFileSync(file, { format: 'jed', domain: domain })

    // Fix for jed format right now...
    Object.keys(poData.locale_data[domain]).forEach(function (key) {
      var val = poData.locale_data[domain][key];
      if (!key) return;
      if (val[0] === null) val.shift();
    });

    acc.locale_data[domain] = poData.locale_data[domain];
    return acc;
  }, { domain: 'messages_main', locale_data: {} })

  return new Jed(data);
}

env = require('./nunjucks/env')(router, getJed());

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

console.log('Starting server...')
console.log('Verifying Editors\' Notes API address at ' + API_URL + '...')
request({
  url: API_URL,
  headers: {'Accept': 'application/json'}
}, function (err) {
  if (err) {
    if (err.code === 'ECONNREFUSED') {
      throw new Error('Could not connect to Editor\'s Notes API server at ' + API_URL);
    }
  }

  console.log('Server started');
  server = http.createServer(function (req, res) {
    router.dispatch(req, res, function (err) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(env.render('404.html', { message: err }));
      }
    });
  });
  server.listen(SERVER_PORT);
});

