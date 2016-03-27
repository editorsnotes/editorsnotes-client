"use strict"

var N3 = require('n3')
  , jsonld = require('jsonld')

// if `text` is an object, it will be assumed to be JSON-LD. If not, it will
// be parsed as is by N3, which allows turtle, TriG, n-triples, and n-quads.
module.exports = function(text) {
  var store = N3.Store()
    , parser = N3.Parser()
    , rdfStringPromise

  store.addPrefixes(require('../namespaces'));

  rdfStringPromise = typeof text === 'string' ?
    text :
    jsonld.promises.toRDF(text, { format: 'application/nquads' });

  return (
    Promise.resolve(rdfStringPromise)
      .then(rdfString => new Promise(function (resolve, reject) {
        parser.parse(rdfString.trim(), function (err, triple, prefixes) {
          if (err) {
            console.log('rejecting')
            reject(err);
          } else if (triple) {
            store.addTriple(triple);
          } else {
            resolve(store);
          }
        });
      }))
  )
}
