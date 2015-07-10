"use strict";

var Immutable = require('immutable')
  , ensureImmutable = require('./ensure_immutable')

function runValidator(data, validator) {
  var { field, value, passFn, message } = validator.toJS();

  if (value === undefined) value = data.get(field);
  return passFn(value, data) ?
    Immutable.List() :
    Immutable.List.of(Immutable.Map({ field, message }))
}

module.exports = function validate(data, validators, firstLevel=true) {
  var errors = Immutable.List();

  validators = ensureImmutable(validators);

  validators.forEach(validator => {
    var error = validator instanceof Immutable.List ?
      validate(data, validator, false) :
      runValidator(data, validator)

    if (!error.size) return true;

    errors = errors.concat(error);

    // Stop iteration on error (if not on first level)
    if (!firstLevel) return false;
  });

  return errors;
}
