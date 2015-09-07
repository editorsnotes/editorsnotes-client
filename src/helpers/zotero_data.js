"use strict";

var Immutable = require('immutable')

function isEmptyItem(data) {
  return !data
    .delete('itemType')
    .delete('tags')
    .delete('collections')
    .delete('relations')
    .some(val => val instanceof Immutable.Iterable ? isEmptyItem(val) : !!val)
}

module.exports = { isEmptyItem }
