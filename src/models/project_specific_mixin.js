"use strict";

var _ = require('underscore')
  , Project = require('./project')

/*
 * Mixin for models which require a project to be set.
 *
 * Looks for attribute, collection, and explicit passing in options. Will raise
 * an error if no project is found, or if different projects are found.
 */
module.exports = {
  constructor: function (attributes, options) {
    var candidates, results, slug;

    candidates = {
      options: options && options.project,
      collection: options && options.collection && options.collection.project,
      attributes: attributes && typeof attributes.project === 'object' && attributes.project,
      attributes_slug: attributes && typeof attributes.project_slug === 'string' && attributes.project_slug,
    }

    if (candidates.attributes) {
      slug = candidates.attributes.url.match(/[^\/]+/g).slice(-1);
      candidates.attributes = new Project({
        name: candidates.attributes.name,
        slug: slug
      });
    } else if (candidates.attributes_slug) {
      candidates.attributes_slug = new Project({
        slug: candidates.attributes_slug
      });
    }

    results = _.chain(candidates).filter(function (p) { return p instanceof Project });

    if (!results.value().length) {
      throw new Error('Must pass a project object, either in options, collection, or attributes.');
    }


    if (results.map(function (p) { return p.get('slug') }).flatten().uniq().value().length > 1) {
      throw new Error('Two different projects passed.')
    }

    // Take the first result
    this.project = results.first().value();
  }
}
