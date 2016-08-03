"use strict";

const NAMESPACES = {};


[

  ["dc", "http://purl.org/dc/terms/"],
  ["hydra", "http://www.w3.org/ns/hydra/core#"],
  ["itm", "http://spi-fm.uca.es/spdef/models/genericTools/itm/1.0#"],
  ["rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#"],
  ["rdfs", "http://www.w3.org/2000/01/rdf-schema#"],
  ["schema", "http://schema.org/"],
  ["vaem", "http://www.linkedmodel.org/schema/vaem#"],
  ["wn", "https://workingnotes.org/v#"],
  ["xsd", "http://www.w3.org/2001/XMLSchema#"],

].forEach(([prefix, url]) => {
  Object.defineProperty(NAMESPACES, prefix, {
    value: url,
    enumerable: true,
  });
});


module.exports = NAMESPACES;
