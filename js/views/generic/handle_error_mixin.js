"use strict";

var _ = require('underscore')

module.exports = {
  initialize: function () {
    if (this.model) {
      this.listenTo(this.model, 'error', this._handleError);
      this.listenTo(this.model, 'request', this._emptyErrors);
    }
    if (this.collection) {
      this.listenTo(this.collection, 'error', this._handleError);
      this.listenTo(this.collection, 'request', this._emptyErrors);
    }
  },
  _handleError: function (modelOrCollection, resp, options) {
    var template = require('../../templates/error_message.html')
      , miscErrors = {}

    _.forEach(resp.responseJSON, function (errors, key) {
      var $container = this.$('[data-error-target="' + key + '"]')
        , errorObj = {}

      errorObj[key] = errors;
      $container.prepend(template({ errors: errorObj, includeLabel: false }));

      if (!$container.length) {
        miscErrors[key] = errors;
      }
    }, this);

    if (!_.isEmpty(miscErrors)) {
      this.$el.prepend(template({ errors: miscErrors, includeLabel: true }));
    }
  },
  _emptyErrors: function () {
    this.$('.error-message').remove();
  }
}
