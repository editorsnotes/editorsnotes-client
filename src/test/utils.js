"use strict";

const test = require('blue-tape')


if (process.browser) {
  test('Citation generator', t => {
    const CitationGenerator = require('../utils/citation_generator')
        , generator = new CitationGenerator()

    t.plan(2);

    const testData = {
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
}


test('Generic shouldComponentUpdate function', t => {
  const shouldUpdate = require('../utils/should_update')
      , Immutable = require('immutable')

  t.plan(4);

  t.equals(true, shouldUpdate({}, {a: 1}));
  t.equals(false, shouldUpdate({a: 1}, {a: 1}));
  t.equals(false, shouldUpdate(
    {a: Immutable.fromJS({ key: 'value'})},
    {a: Immutable.fromJS({ key: 'value' })}
  ));
  t.equals(false, shouldUpdate(
    {a: 1, b: 2},
    {b: 2},
    ['a']
  ));
});


test('LD Parser', t => {
  const parseLD = require('../utils/parse_ld')

  return Promise.resolve()
    .then(() =>
      parseLD('<http://example.com/a> <http://example.com/b> <http://example.com/c> .')
        .then(store => {
          t.equal(1, store.length, 'should parse turtle/ntriples into arrays of triple objects');
        })
    )
    .then(() =>
      parseLD({
        '@id': 'http://example.com/a',
        'http://example.com/b': { '@id': 'http://example.com/c' }
      }).then(store => {
        t.equal(1, store.length, 'should parse JSON-LD into arrays of triple objects');
      })
    )
});

test('Generic response handler', t => {
  const handleResponse = require('../utils/handle_response')

  return Promise.resolve()
    .then(() => {
      const fakeResponse = { ok: true }

      return handleResponse(fakeResponse).then(ret => {
        t.equal(fakeResponse, ret, 'should pass through responses if they are marked OK');
      })
    })
    .then(() => {
      const { HTTPClientError, HTTPServerError } = require('../errors')

      const fakeResponse = {
        headers: new Map([['Content-Type', 'application/json']]),
        json: () => Promise.resolve({})
      }

      const fakeClientErrorResp = Object.assign({}, fakeResponse, { status: 400 })
          , fakeServerErrorResp = Object.assign({}, fakeResponse, { status: 500 })

      return Promise.all([
        t.shouldFail(handleResponse(fakeClientErrorResp), HTTPClientError),
        t.shouldFail(handleResponse(fakeServerErrorResp), HTTPServerError)
      ])
    })
})
