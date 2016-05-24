"use strict";

const RouteRecognizer = require('route-recognizer')

function Router() {
  this.recognizer = new RouteRecognizer();

  this.add(require('./base_routes'));
  this.add(require('./admin_routes'));
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

module.exports = Router;
