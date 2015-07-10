"use strict";

var Immutable = require('immutable')

module.exports = function (item) {
  var itemString

  if (item instanceof Immutable.Iterable) return item;

  itemString = item.toString();

  if (itemString === '[object Object]' || itemString === '[object Array]') {
    return Immutable.fromJS(item);
  }

  throw Error('Can only convert arrays or plain objects to immutable objects.');
}
