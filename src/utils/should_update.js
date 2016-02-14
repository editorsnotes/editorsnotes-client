"use strict";

var Immutable = require('immutable')

// Returns false if objA and objB are equal
module.exports = function(objA, objB, excludedKeys=[]) {
  var aKeys = Object.keys(objA)
    , bKeys = Object.keys(objB)
    , shouldUpdate = false
    , aVal
    , bVal

  excludedKeys.forEach(key => {
    var aIdx = aKeys.indexOf(key)
      , bIdx = bKeys.indexOf(key)

    if (aIdx > -1) aKeys.splice(aIdx, 1);
    if (bIdx > -1) bKeys.splice(aIdx, 1);
  });

  if (aKeys.length !== bKeys.length) return true;
  if (!aKeys.every(key => objB.hasOwnProperty(key))) return true;

  for (var i = 0; i < aKeys.length; i++) {
    aVal = objA[aKeys[i]];
    bVal = objB[aKeys[i]];

    if (aVal instanceof Immutable.Iterable) {
      shouldUpdate = !Immutable.is(aVal, bVal);
    } else {
      shouldUpdate = aVal !== bVal;
    }

    if (shouldUpdate) break;
  }

  return shouldUpdate;
}
