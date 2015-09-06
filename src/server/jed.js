"use strict";

var child_process = require('child_process')
  , Jed = require('jed')
  , path = require('path')
  , po2json = require('po2json')
  , localePath
  , files
  , data

localePath = path.join(__dirname, '..', '..', 'locale');

files = child_process
  .execSync('find ' + localePath + ' -type f -name *po', { encoding: 'utf-8' })
  .trim()
  .split('\n');

data = files.reduce(function (acc, file) {
  var domain = 'messages_' + path.basename(file).replace('.po', '')
    , poData = po2json.parseFileSync(file, { format: 'jed1.x', domain: domain })

  acc.locale_data[domain] = poData.locale_data[domain];
  return acc;
}, { domain: 'messages_main', locale_data: {} });

module.exports = new Jed(data);
