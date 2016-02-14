"use strict";

var test = require('tape')


test('Citation generator', function (t) {
  var CitationGenerator = require('../utils/citation_generator')
    , generator = new CitationGenerator()
    , testData

  t.plan(2);

  testData = {
    id: 'testing',
    type: 'book',
    title: 'Living My Life',
    author: [{ family: 'Goldman', given: 'Emma' }],
    issued: { raw: '1931' }
  }

  t.notEqual(
    generator.engine,
    undefined,
    'should be able to be created'
  );

  t.equal(
    generator.makeCitation(testData),
    'Emma Goldman, <em>Living My Life</em>, 1931.',
    'should be able to produce citations'
  );
});


test('Generic shouldComponentUpdate function', function (t) {
  var shouldUpdate = require('../utils/should_update')
    , Immutable = require('immutable')

  t.plan(4);

  t.equals(true, shouldUpdate({}, {a: 1}));

  t.equals(false, shouldUpdate({a: 1}, {a: 1}));

  t.equals(false, shouldUpdate(
    {a: Immutable.fromJS({ key: 'value'})},
    {a: Immutable.fromJS({ key: 'value' })}
  ));

  t.equals(false, shouldUpdate({a: 1, b: 2}, {b: 2}, ['a']))
});
