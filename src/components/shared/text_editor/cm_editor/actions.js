"use strict";

var Immutable = require('immutable')
  , utils = require('./utils')


// Given a codemirror instance and a change object (the arguments passed by
// the inputRead event), call the handleAddReference function if the change
// object was an empty reference.
function checkEmptyReferences(cm, { to, text }) {
  var token = cm.getTokenAt(to)

  if (token.type && token.type.indexOf('reference-empty') === 0) {
    let isEmptyText = text.length === 1 && text[0] === ' '
      , type

    if (isEmptyText) return;

    type = token.type.slice(16);
    if (cm.handleAddReference) cm.handleAddReference(type);
  }
}


// Replace a reference (as returned by getUnmarkedReferences) with a span
// whose text content is the appropriate label for the reference's item type.
function replaceInlineReference(cm, { itemType, itemID, startPos, endPos }) {
  var { getReferenceLabel, getInlineCitation } = cm
    , replacementEl = document.createElement('span')
    , labelPromise

  replacementEl.style.background = 'rgba(50, 115, 160, .3)';
  replacementEl.style.padding = '0 3px';
  replacementEl.style.borderRadius = '4px';
  replacementEl.onclick = selectAfterClickedMarkedSpan.bind(null, cm);

  if (itemType === 'document') {
    labelPromise = getInlineCitation(itemID);
  } else {
    labelPromise = getReferenceLabel(itemType, itemID);
  }

  labelPromise.then(label => {
    replacementEl.innerHTML = label;
    cm.doc.markText(startPos, endPos, { replacedWith: replacementEl });
  });
}

function markCitationBlock(cm, { itemID, startPos, endPos }) {
  var { getFullCitation } = cm
    , closingToken = utils.getClosingBlockToken(cm, startPos.line)

  // If there's not a closing token yet, don't mark the section
  if (!closingToken) return;

  getFullCitation(itemID).then(label => {
    var openingEl = document.createElement('span')
      , closingEl = document.createElement('span')
      , mark

    openingEl.innerHTML = label;
    openingEl.style.background = 'red';
    openingEl.style.padding = '0 3px';
    openingEl.style.borderRadius = '4px';

    cm.doc.markText(startPos, endPos, { replacedWith: openingEl });
    cm.doc.markText(closingToken.startPos, closingToken.endPos, { replacedWith: closingEl });

    mark = cm.doc.markText(startPos, closingToken.endPos);

    cm._sectionMarks.push(mark);

    mark.lines.forEach(line => {
      cm.addLineClass(line, 'text', 'CITATION-BLOCK');
    });
  });
}


// Move the selection cursor immediately to the right of a click event's
// target (meant to be attached to marked spans)
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


function updateDocumentMarks(cm, fromLine, toLine) {
  var { getUnmarkedReferences } = require('./utils')

  Immutable.Range(fromLine, toLine + 1).toList()
    .map(lineNumber => Immutable.List(getUnmarkedReferences(cm, lineNumber)))
    .flatten(true)
    .forEach(reference => {
      if (reference.itemType === 'citationBlock-start') {
        markCitationBlock(cm, reference)
      } else {
        replaceInlineReference(cm, reference);
      }
    });
}

module.exports = {
  checkEmptyReferences,
  updateDocumentMarks,
}
