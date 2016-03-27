"use strict";

var namespaces = require('../namespaces')
  , { getLiteralValue, expandPrefixedName } = require('n3').Util


function findOne(store, s, p, o, g) {
  return store.find(s, p, 0, g)[0] || null;
}


function getPredicateLiteral(store, s, p, g) {
  var quad = findOne(store, s, p, null, g);
  return quad && getLiteralValue(quad.object);
}



function getHydraLinks(store) {
  var links = [];

  store
    .find(null, 'rdf:type', 'hydra:Link')
    .map(({ subject }) => {
      var uri = findOne(store, null, subject).object

      store.find(subject, 'hydra:supportedOperation').forEach(({ object }) => {
        var expects = (findOne(store, object, 'hydra:expects') || {}).object
          , returns = (findOne(store, object, 'hydra:returns') || {}).object

        links.push({
          uri,
          expects,
          returns,
          type: findOne(store, object, 'rdf:type').object,
        })
      });

    });

  return links;
}

function getLinkURI(store, expectsType, operation) {
  var links = getHydraLinks(store);

  for (var i = 0; i < links.length; i++) {
    let link = links[i];

    if (link.expects === expectsType && (
      link.type === operation ||
      link.type === expandPrefixedName(operation, namespaces)
    )) {
      return link.uri;
    }
  }

  return null;
}


module.exports = {
  findOne,
  getLinkURI,
  getHydraLinks,
  getPredicateLiteral,
}
