"use strict";

function getGraph(topic, graphName) {
  return topic.getIn(['data', topic.get('url') + graphName, '@graph']);
}

function getWNGraph(topic) {
  return getGraph(topic, 'w/')
}

function getProjectGraph(topic) {
  return getGraph(topic, 'p/')
}

module.exports = { getWNGraph, getProjectGraph }
