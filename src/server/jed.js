"use strict";

var child_process = require('child_process')
  , Jed = require('jed')
  , path = require('path')
  , po2json = require('po2json')
  , files
  , data

files = child_process
  .execSync('find ../locale -type f -name *po', { encoding: 'utf-8' })
  .trim()
  .split('\n');

data = files.reduce(function (acc, file) {
  var domain = 'messages_' + path.basename(file).replace('.po', '')
    , poData = po2json.parseFileSync(file, { format: 'jed', domain: domain })

  // Fix for jed format right now...
  Object.keys(poData.locale_data[domain]).forEach(function (key) {
    var val = poData.locale_data[domain][key];
    if (!key) return;
    if (val[0] === null) val.shift();
  });

  acc.locale_data[domain] = poData.locale_data[domain];
  return acc;
}, { domain: 'messages_main', locale_data: {} });

module.exports = new Jed(data);
