"use strict";

var Immutable = require('immutable')

function runValidator(data, { field, value, passFn, message }) {
  if (value === undefined) value = data.get(field);
  return passFn(value, data) ?
    Immutable.List() :
    Immutable.List(Immutable.Map({ field, message }))
}

function validate(data, validators, errors=Immutable.List()) {
  validators.forEach(validator => {
    var error = Array.isArray(validator) ?
      validate(data, validator) :
      runValidator(data, validator)

    if (!error.size) return true;

    // Stop iteration on error
    errors = errors.concat(error);
    return false;
  });

  return errors;
}

module.exports = { validate };
