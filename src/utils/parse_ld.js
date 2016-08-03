"use strict"

const jsonld = require('jsonld')

// if `text` is an object, it will be assumed to be JSON-LD. If not, it will
// be parsed as is by N3, which allows turtle, TriG, n-triples, and n-quads.
module.exports = function(text) {
  const parser = require('n3').Parser()

  const rdfString = typeof text === 'object'
    ? jsonld.promises.toRDF(text, { format: 'application/nquads' })
    : text

  return Promise.resolve(rdfString).then(rdfString =>
    new Promise((resolve, reject) => {
      const triples = [];

      parser.parse(rdfString.trim(), (err, triple) => {
        if (err) {
          reject(err);
        } else if (triple) {
          triples.push(triple);
        } else {
          resolve(triples);
        }
      });
    })
  )
}
