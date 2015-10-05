"use strict";

var fs = require('fs')
  , styles = {}

styles['chicago-fullnote-bibliography'] = fs.readFileSync(__dirname + '/../../lib/citeproc-js/styles/chicago-fullnote-bibliography.csl', 'utf8');
styles['chicago-author-date'] = fs.readFileSync(__dirname + '/../../lib/citeproc-js/styles/chicago-author-date.csl', 'utf8');

module.exports = styles;
