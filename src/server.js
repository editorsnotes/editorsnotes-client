"use strict";

require('babel/register');

var cookie = require('cookie')
  , http = require('http')
  , request = require('request')
  , Router = require('./router')
  , router = new Router()
  , server
  , env


const API_URL = 'http://localhost:8001'
    , SERVER_PORT = 8450


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
    Object.keys(poData.local_data[domain]).forEach(function (key) {
      var val = poData[domain][key];
      if (!key) return;
      if (val[0] === null) val.shift();
    });

    acc.locale_data[domain] = poData[domain];
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
    var that = this
      , template = config.View.prototype.template || 'base.html'
      , fetch = !!(config.Model || config.Collection || config.fetch) && config.fetch !== false
      , cookies = cookie.parse(this.req.headers.cookie || '')
      , options
      , model
      , url

    if (config.Model) {
      model = new config.Model(params);
      url = model.url();
    } else {
      url = this.req.url;
    }

    url = API_URL + url;

    if (fetch) {
      options = {
        url: url,
        headers: {
          'Host': this.req.headers.host,
          'Accept': 'application/json'
        }
      }
      if (cookies.token) {
        options.headers.Authorization = 'Token ' + cookies.token;
      }

      request(options, function (error, response, body) {
        if (error) {
          console.log('ERROR\n==========');
          console.log(error);
          console.log('=========');
          that.res.writeHead(500);
          that.res.end('<h1>Server error: ' + that.res.statusCode + '</h1>' + body)
        }
        that.res.writeHead(200, { 'Content-Type': 'text/html' });

        try {
          if (that.res.statusCode === 200) {
            that.res.end(env.render(template, {
              server: true,
              bootstrap: body,
              data: JSON.parse(body)
            }));
          } else {
            that.res.end('<h1>Server error: ' + that.res.statusCode + '</h1>' + body)
          }
        } catch (e) {
          that.res.end(
            '<h1>Rendering error</h1>' +
            '<p>' + e + '</p>' +
            '<h2>Stack</h2>' +
            '<pre>' + e.stack + '</pre>')
        }
      });
    } else {
      that.res.writeHead(200, { 'Content-Type': 'text/html' });
      that.res.end(env.render(template, { server: true }));
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

