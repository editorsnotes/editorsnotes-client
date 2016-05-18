"use strict";

const RouteRecognizer = require('route-recognizer')
    , isNode = typeof window === 'undefined'

function Router(generateRouteHandler) {
  this.recognizer = new RouteRecognizer();
  this.generateRouteHandler = generateRouteHandler;
}

Router.prototype.add = function (paths) {
  Object.keys(paths).forEach(path => {
    const route = { path, handler: paths[path] }
    this.recognizer.add([route], { as: route.handler.name });
  });
}


Router.prototype.match = function (url) {
  const match = this.recognizer.recognize(url)

  if (!match) return null;

  const ret = match[0];
  ret.queryParams = match.queryParams;

  return ret;
}


// Match the URL, and then execute the given handler. Throws an error if no
// match is made.
Router.prototype.execute = function (url, context=null) {
  const match = this.match(url)

  if (!match) throw new Error(`No route found for "${url}".`);

  this.generateRouteHandler(match.handler.name, url).apply(context, [
    match.handler,
    match.params,
    match.queryParams
  ]);
}


Router.prototype.reverse = function (name, ...args) {
  if (!this.recognizer.hasRoute(name)) {
    throw new Error(`Router has no route named '${name}'`);
  }

  const params = {}
      , segments = this.recognizer.names[name].segments;

  const requiredParamNames = segments
    .map(seg => seg.name)
    .filter(paramName => paramName)

  const argsAreNamedParams = (
    args.length === 1 &&
    typeof args[0] === 'object' &&
    !Array.isArray(args[0])
  );

  if (argsAreNamedParams) {
    requiredParamNames.forEach(requiredParamName => {
      const arg = params[requiredParamName];

      if (!arg) {
        throw new Error(`Route for ${name} requires a parameter named ${requiredParamName}`)
      }

      params[requiredParamName] = arg;
    })
  } else {
    if (args.length !== requiredParamNames.length) {
      throw new Error(
        `Route for ${name} takes ${requiredParamNames.length} parameters. ` +
        `Number passed: ${args.length}`)
    }
    args.forEach((arg, i) => {
      params[requiredParamNames[i]] = arg
    });
  }

  const addTrailingSlash = Object.keys(segments[segments.length - 1]).length === 0;

  let url = this.recognizer.generate(name, params);

  if (addTrailingSlash && url[url.length - 1] !== '/') {
    url += '/';
  }

  return url;
}


if (isNode) {
  Router.prototype.dispatch = function (req, res, errorCallback) {
    try {
      this.execute(req.url, { req, res });
    } catch(err) {
      errorCallback(err);
    }
  }
}

module.exports = Router;
