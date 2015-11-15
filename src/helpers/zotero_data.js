"use strict";

var Immutable = require('immutable')

function hasCreators(data) {
  return data
    .get('creators', [])
    .some(val => (
      val.get('name', '').length ||
      val.get('firstName', '').length ||
      val.get('lastName', '').length))
}

function isEmptyItem(data) {
  return !hasCreators(data) && !data
    .delete('itemType')
    .delete('tags')
    .delete('collections')
    .delete('relations')
    .delete('creators')
    .some(val => val instanceof Immutable.Iterable ? isEmptyItem(val) : !!val)
}

module.exports = { isEmptyItem }
