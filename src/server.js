"use strict";

var cookie = require('cookie')
  , http = require('http')
  , nunjucks = require('nunjucks')
  , request = require('request')
  , typogr = require('typogr')
  , Router = require('./router')
  , router = new Router()
  , server

function getTemplatePaths() {
  var execSync = require('exec-sync')
    , dirs = execSync('find base_views admin_views -name templates -type d').split('\n')

  return ['templates'].concat(dirs)
}
var API_URL = 'http://localhost:8001'

/*
router.add(require('./index-admin'));
router.add(require('./index-base'));
*/

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(getTemplatePaths()));

var exts = require('./nunjucks-ext');
env.addExtension('url', new exts.URL(router));

env.addFilter('typogrify', function (str) {
  return typogr.typogrify(str);
})

function getJed() {
  var Jed = require('jed');
  var execSync = require('exec-sync')
  var path = require('path')
  var po2json = require('po2json')
  var files = execSync('find ../locale -type f -name *po').split('\n');

  var data = files.reduce(function (acc, file) {
    var domain = 'messages_' + path.basename(file).replace('.po', '');
    var data = po2json.parseFileSync(file, { format: 'jed', domain: domain }).locale_data;

    // Fix for jed format right now...
    Object.keys(data[domain]).forEach(function (key) {
      var val = data[domain][key];
      if (!key) return;
      if (val[0] === null) val.shift();
    });

    acc.locale_data[domain] = data[domain];
    return acc;
  }, { domain: 'messages_main', locale_data: {} })

  return new Jed(data);
}

var jed = getJed();
env.addExtension('trans', new exts.Trans(jed));

router.fallbackHandler = function () {
  return function (config, params, queryParams) {
    var that = this
      , template = config.View.prototype.template
      , fetch = !!(config.Model || config.Collection || config.fetch)
      , cookies = cookie.parse(this.req.headers.cookie || '')
      , options

    if (fetch) {
      options = {
        url: API_URL + this.req.url,
        headers: {
          'Host': this.req.headers.host,
          'Accept': 'application/json'
        }
      }
      if (cookies.token) {
        options.headers.Authorization = 'Token ' + cookies.token;
      }

      request(options, function (error, response, body) {
        if (error) throw new Error('dangit');
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

var server = http.createServer(function (req, res) {
  router.dispatch(req, res, function (err) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(env.render('404.html', { message: err }));
    }
  });
});

server.listen(8450);
