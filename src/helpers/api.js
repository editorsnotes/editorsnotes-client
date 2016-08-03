"use strict";

var { getWNGraph } = require('./topic')

function getEmbedded(data, key) {
  var val = data.get(key)

  return typeof val === 'string' ?
    data.getIn(['embedded', val]) :
    val.map(url => data.getIn(['embedded', url]))
}

function getDisplayTitle(item) {
  var type = getType(item);

  switch(type) {
    case 'Note':
      return item.get('title');
    case 'Document':
      return item.get('description');
    case 'Topic':
      return item.getIn(['wn_data', '@graph', '@graph', 'preferred_name'])
    default:
      throw new Error(`Not able to get label for item of type: ${type}`);
  }
}

function getType(item) {
  return item.get('type').split('#')[1];
}

module.exports = { getEmbedded, getType, getDisplayTitle }
