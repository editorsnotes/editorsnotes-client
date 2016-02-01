"use strict";

function getEmbedded(data, key) {
  var val = data.get(key)

  return typeof val === 'string' ?
    data.getIn(['embedded', val]) :
    val.map(url => data.getIn(['embedded', url]))
}

const DISPLAY_ATTRS = {
  'Note': 'title',
  'Topic': 'preferred_name',
  'Document': 'description'
}

function getDisplayTitle(item) {
  return item.get(DISPLAY_ATTRS[getType(item)]);
}

function getType(item) {
  return item.get('type').split('#')[1];
}

module.exports = { getEmbedded, getType, getDisplayTitle }
