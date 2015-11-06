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
