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
  var { getReferenceLabel, getInlineCitation } = cm

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
    .forEach(ref => {
      var replacementEl = document.createElement('span')
        , labelPromise

      replacementEl.style.background = '#ccc';
      replacementEl.style.padding = '1px 4px';
      replacementEl.style.borderRadius = '4px';

      if (ref.itemType === 'document') {
        labelPromise = getInlineCitation(ref.itemID);
      } else {
        labelPromise = getReferenceLabel(ref.itemType, ref.itemID);
      }

      labelPromise
        .then(label => {
          replacementEl.textContent = label;

          cm.doc.markText(ref.startPos, ref.endPos, {
            replacedWith: replacementEl
          })
        })
    })
}
