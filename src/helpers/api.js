"use strict";

function getEmbedded(data, key) {
  var val = data.get(key)

  return typeof val === 'string' ?
    data.getIn(['_embedded', val]) :
    val.map(url => data.getIn(['_embedded', url]))
}

module.exports = { getEmbedded }
