"use strict";

// Given a function, returns a new function that will call the given function
// and will either reraise an error or return the val passed to it. Meant to be
// used as a passthrough for a promise callback (emulating something like
// `Promise.always`.

module.exports = function (fn) {
  return function (val) {
    fn();
    if (val instanceof Error) throw val;
    return val;
  }
}
