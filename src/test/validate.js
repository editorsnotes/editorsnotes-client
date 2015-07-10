"use strict";

var test = require('tape')

test('validate function', function (t) {
  var Immutable = require('immutable')
    , validate = require('../utils/validate')
    , validator

  t.plan(2);

  validator = Immutable.fromJS([
    {
      field: 'name',
      passFn: field => field === 'patrick',
      message: "name's gotta be patrick"
    }
  ]);

  t.deepEqual(
    validate(Immutable.Map({ name: 'patrick' }), validator).toJS(),
    [],
    'should return empty List for valid data'
  );

  t.deepEqual(
    validate(Immutable.Map({ name: 'sara' }), validator).toJS(),
    [{ field: 'name', message: "name's gotta be patrick" }],
    'should return a List of errors when there are errors'
  );
});

test('nested validate function', function (t) {
  var Immutable = require('immutable')
    , validate = require('../utils/validate')
    , validator

  t.plan(2);

  validator = Immutable.fromJS([
    [
      {
        field: 'color',
        passFn: field => /red|green|blue/.test(field),
        message: 'invalid color'
      },
      {
        field: 'color',
        passFn: field => /light|dark/.test(field),
        message: 'color must have a shade'
      }
    ],
    [
      {
        field: 'size',
        passFn: field => field > 6,
        message: 'size must be greater than 6!'
      }
    ]
  ]);

  t.deepEqual(
    validate(Immutable.Map({ color: 'potato', size: 3 }), validator).toJS(),
    [
      { field: 'color', message: 'invalid color' },
      { field: 'size', message: 'size must be greater than 6!' }
    ],
    'should run tests at all levels until a test fails'
  );

  t.deepEqual(
    validate(Immutable.Map({ color: 'light blue', size: 12 }), validator).toJS(),
    [],
    'should return an empty List when tests pass at all levels'
  );
})
