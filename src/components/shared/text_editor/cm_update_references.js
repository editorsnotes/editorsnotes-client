"use strict";

var Immutable = require('immutable')

function isReferenceToken(token) {
  return (
    (token.type || '').indexOf('reference-') === 0 &&
    token.type.indexOf('empty') === -1
  )
}

function referenceTypeFromToken(token) {
  return token.type.replace('reference-', '')
}

function hasNotBeenMarked(cm, token) {
  var marks = cm.findMarksAt(token.startPos);

  if (!marks.length) return true;

  return marks.some(mark => (
    mark.lines.length === 1 &&
    mark.lines[0].markedSpans.length === 1 &&
    mark.lines[0].markedSpans[0].from === token.startPos.ch &&
    mark.lines[0].markedSpans[0].to === token.endPos.ch
  ))
}

module.exports = function updateInlineReferences(cm, fromLine, toLine) {
  Immutable.Range(fromLine, toLine + 1)
    .toList()
    .map(line => Immutable.List(
      cm.getLineTokens(line)
        .filter(isReferenceToken)
        .map(token => ({
          startPos: { line, ch: token.start },
          endPos: { line, ch: token.end },
          itemType: referenceTypeFromToken(token),
          itemID: token.string.match(/\d+/)[0]
        }))
        .filter(hasNotBeenMarked.bind(null, cm))))
    .flatten(true)
    .forEach(ref => cm.doc.markText(ref.startPos, ref.endPos, {
      css: "color: red;", // FIXME: Placeholder
      atomic: true
    }))
}
