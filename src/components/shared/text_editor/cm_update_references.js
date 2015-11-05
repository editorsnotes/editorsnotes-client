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

function selectAfterClickedMarkedSpan(cm, e) {
  var allMarks = cm.doc.getAllMarks()
    , clickedMark
    , clickedLine
    , clickedMarkedSpan

  for (let i = 0; i < allMarks.length; i++) {
    if (allMarks[i].replacedWith === e.currentTarget) {
      clickedMark = allMarks[i];
      break;
    }
  }

  clickedLine = clickedMark.lines[clickedMark.lines.length - 1];

  for (let i = 0; i < clickedLine.markedSpans.length; i++) {
    let markedSpan = clickedLine.markedSpans[i]

    if (markedSpan.marker.replacedWith === e.currentTarget) {
      clickedMarkedSpan = markedSpan;
      break;
    }
  }

  cm.focus();
  cm.doc.setSelection({
    line: cm.doc.getLineNumber(clickedLine),
    ch: clickedMarkedSpan.to
  });
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

      replacementEl.style.background = 'rgba(50, 115, 160, .3)';
      replacementEl.style.padding = '0 3px';
      replacementEl.style.borderRadius = '4px';
      replacementEl.onclick = selectAfterClickedMarkedSpan.bind(null, cm);

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
          });
        })
    })
}
