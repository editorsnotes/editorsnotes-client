"use strict";

var Immutable = require('immutable')
  , utils = require('./cm_utils')


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


function updateDocumentMarks(cm, fromLine=0, toLine) {
  var checkLine = fromLine
    , ranges = []

  if (toLine === undefined) toLine = cm.doc.lineCount();

  if (utils.isInSection(cm, fromLine)) {
    let initialRange = utils.getSectionRange(cm, null, fromLine);
    ranges.push(initialRange);

    // Advance past the end of this range
    checkLine = initialRange[1] + 1;
  }

  while (checkLine <= toLine) {
    if (utils.isInSection(cm, checkLine)) {
      let range = utils.getSectionRange(cm, checkLine);
      ranges.push(range);

      // Advance to the end of this range
      checkLine = range[1];
    }

    checkLine += 1;
  }

  // TODO: Now, run markText for each of these ranges if they do not already
  // exist in cm._sectionMarks
}


// Replace a reference (as returned by getUnmarkedReferences) with a span
// whose text content is the appropriate label for the reference's item type.
function replaceReference(cm, { itemType, itemID, startPos, endPos }) {
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
    replacementEl.textContent = label;
    cm.doc.markText(startPos, endPos, { replacedWith: replacementEl });
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


function updateInlineReferences(cm, fromLine, toLine) {
  var { getUnmarkedReferences } = require('./cm_utils')

  Immutable.Range(fromLine, toLine + 1).toList()
    .map(lineNumber => Immutable.List(getUnmarkedReferences(cm, lineNumber)))
    .flatten(true)
    .forEach(replaceReference.bind(null, cm))
}

module.exports = {
  checkEmptyReferences,
  updateDocumentMarks,
  updateInlineReferences,
}
