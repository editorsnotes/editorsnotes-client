"use strict";

var Immutable = require('immutable')

/*
 * Given an Immutable.Map of an API response, return a new Map whose keys are
 * the link rels in the given resource and whose values are the links
 * themselves.
 */
module.exports = function (apiData) {
  return apiData.get('_links', Immutable.List())
      .toMap()
      .mapKeys((k, v) => v.get('rel'))
}
