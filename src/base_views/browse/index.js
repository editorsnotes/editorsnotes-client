"use strict";

var Backbone = require('../../backbone')

module.exports = Backbone.View.extend({
  template: 'browse.html',
  fetch: function (options) {
    var ajax = require('../../ajax');
    return ajax('/browse/', options);
  },
  initialize: function () {
  }
});
