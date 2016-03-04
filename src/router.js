"use strict";

var RouteRecognizer = require('route-recognizer')
  , isNode = typeof window === 'undefined'


// Routes should be an array of Objects with the following shape:
//
// {
//   '/routeA/': {
//     name: 'routename',
//     Component: RouteComponent,
//     getData: functionToGetData (Promise-returning)
//   },
//
//   '/routeB/': { ... },
//   etc.
// }
//
function Router(routes, onRoute) {
  var allRoutes = Object.assign.apply(Object, [{}].concat(routes))

  this.recognizer = new RouteRecognizer();
  this.onRoute = onRoute;

  Object.keys(allRoutes).forEach(path => {
    var handler = allRoutes[path];
    this.recognizer.add([{ path, handler }], { as: handler.name });
  })
}


Router.prototype.match = function (url) {
  var match = this.recognizer.recognize(url)
    , ret

  if (!match) return null;

  ret = match[0];
  ret.queryParams = match.queryParams;
  return ret;
}


// Attempt to match the given URL, and then execute the onRoute handler if a match is found.
Router.prototype.execute = function (url, context) {
  var match = this.match(url)

  if (!match) throw new Error('No route found for "' + url + '".');

  this.onRoute.call(context || null, url, match.handler, match.params, match.queryParams);
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
    params = args[0];

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
