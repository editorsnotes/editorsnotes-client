"use strict";

var _ = require('underscore')
  , RouteRecognizer = require('route-recognizer')
  , isNode = typeof window === 'undefined'

function Router() {
  this.recognizer = new RouteRecognizer();
  this.handlers = {};
  this.fallbackHandler = null;
}

Router.prototype.add = function (path, opts) {
  var _path;

  if (_.isObject(path)) {
    _.forEach(path, function (opts, path) {
      this.add(path, opts);
    }, this);
  } else {
    if (typeof path === 'object') {
      _path = path.path;
      delete path.path;
      opts = path;
    } else {
      _path = path;
    }
    this.recognizer.add([{ path: _path, handler: opts }], { as: opts.name });
  }
}

Router.prototype.registerHandlers = function (obj) { this.handlers = obj; }
Router.prototype.registerFallbackHandler = function (fn) { this.fallbackHandler = fn }

Router.prototype.match = function (url) {
  var match = this.recognizer.recognize(url)
    , ret

  if (!match) return null;

  ret = match[0];
  ret.queryParams = match.queryParams;
  return ret;
}

// Match the URL, and then execute the given handler. Throws an error if no
// match is made.
Router.prototype.execute = function (url, context) {
  var match = this.match(url)
    , handler

  if (!match) throw new Error('No route found for "' + url + '".');
  handler = this.handlers[match.handler.name];

  if (!handler) {
    if (!this.fallbackHandler) {
      throw new Error('No handler found for route "' + match.handler.name + '".');
    } else {
      handler = this.fallbackHandler(match.handler.name, url);
    }
  }

  if (context !== undefined) {
    handler.call(context, match.handler, match.params, match.queryParams);
  } else {
    handler(match.handler, match.params, match.queryParams);
  }
}

Router.prototype.reverse = function (name) {
  var args = Array.prototype.slice.call(arguments, 1)
    , segments
    , namedParams
    , params
    , addTrailingSlash
    , url

  if (!this.recognizer.hasRoute(name)) {
    throw new Error('Router has no route named: ' + name);
  }

  segments = this.recognizer.names[name].segments;
  namedParams = segments.filter(function (seg) {
    return seg.hasOwnProperty('name');
  }).map(function (seg) {
    return seg.name
  });

  if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])) {
    params = args;
    namedParams.forEach(function (requiredParam) {
      if (!params.hasOwnProperty(requiredParam)) {
        throw new Error('Route for ' + name + ' requires a parameter named: ' + requiredParam);
      }
    });
  } else {
    if (args.length !== namedParams.length) {
      throw new Error('Route for ' + name + ' takes ' + namedParams.length +
          ' parameters. Number passed: ' + args.length);
    }
    params = {};
    args.forEach(function (arg, idx) { params[namedParams[idx]] = arg });
  }

  addTrailingSlash = Object.keys(segments[segments.length - 1]).length === 0;
  url = this.recognizer.generate(name, params);

  if (addTrailingSlash && url[url.length - 1] !== '/') {
    url += '/';
  }

  return url;
}

if (isNode) {
  Router.prototype.dispatch = function (req, res, errorCallback) {
    try {
      this.execute(req.url, { req: req, res: res });
    } catch(err) {
      errorCallback(err);
    }
  }
}

module.exports = Router;
