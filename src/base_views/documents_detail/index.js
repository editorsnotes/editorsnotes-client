"use strict";

var Backbone = require('../../backbone')

module.exports = Backbone.Model.extend({
  template: 'document_show.html',
  getBreadcrumb: function (data) {
    var docName = data.description

    docName = docName.replace(/<[^>]+>/g, '');

    return [
      [data.project.name, data.project.url],
      ['Documents', data.url.replace(/[^\/]+\/$/, '')],
      [docName, data.url]
    ]
  }
});
