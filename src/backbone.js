"use strict";

var Backbone = require('backbone')
  , oldSync = Backbone.sync
  , oldURL = Backbone.Model.prototype.url

if (typeof window != 'undefined') {
  Backbone.$ = require('./jquery');
  require('backbone.stickit');
}

Backbone.Model.prototype.url = function () {
  var origURL = oldURL.call(this);
  return origURL.slice(-1) === '/' ? origURL : origURL + '/';
}

Backbone.sync = function (method, model, options) {
  
  return oldSync(method, model, options);
}

module.exports = Backbone;
