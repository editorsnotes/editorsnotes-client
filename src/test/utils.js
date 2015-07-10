"use strict";

var assert = require('assert')
  , _ = require('underscore')


describe('Citation generator', function () {
  var CitationGenerator = require('../utils/citation_generator');

  it('should be able to be created', function () {
    var testGenerator = new CitationGenerator();
    assert.notEqual(testGenerator.engine, undefined);
  });

  it('should be able to produce citations', function () {
    var testGenerator = new CitationGenerator()
      , testData = {
        id: 'testing',
        type: 'book',
        title: 'Living My Life',
        author: [{ family: 'Goldman', given: 'Emma' }],
        issued: { raw: '1931' }
      }

    assert.equal(
      testGenerator.makeCitation(testData),
      'Emma Goldman, <em>Living My Life</em>, 1931.'
    )
  });
});

describe('Zotero => CSL converter', function () {
  var converter = require('../utils/zotero_to_csl')

  it('should give me a CSL object when passed a Zotero object', function () {
    var testData
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

    assert.deepEqual(converter(testData), expected);
  });
});
