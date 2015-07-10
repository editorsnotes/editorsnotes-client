"use strict";

var test = require('tape')

test('Citation generator', function (t) {
  t.plan(2);

  var CitationGenerator = require('../utils/citation_generator')
    , generator = new CitationGenerator()
    , testData

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

test('Zotero => CSL converter', function (t) {
  t.plan(1);

  var converter = require('../utils/zotero_to_csl')
    , testData
    , expected

  testData = {
    itemType: 'book',
    title: 'Living My Life',
    creators: [{ creatorType: 'author', firstName: 'Emma', lastName: 'Goldman' }],
    date: '1931'
  }

  expected = {
    type: 'book',
    title: 'Living My Life',
    author: [{ family: 'Goldman', given: 'Emma' }],
    issued: { raw: '1931' }
  }

  t.deepEqual(
    converter(testData),
    expected,
    'should give me a CSL object when passed a Zotero object'
  );
});
