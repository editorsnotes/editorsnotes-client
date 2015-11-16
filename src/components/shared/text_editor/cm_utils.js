"use strict";

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


function isInSection(cm, line) {
  var state = cm.getStateAfter(line);
  return (state.base.inCitation || state.base.inNoteReference);
}


function getSectionRange(cm, start=null, line) {
  if (start === null) {
    // Don't assume this line is the start; go backward first to find the
    // first line of the section.
    let startLine = line

    if (!isInSection(cm, line)) {
      throw new Error(`line ${line} is not in a section`);
    }

    while (startLine > 0) {
      if (!isInSection(cm, startLine - 1)) break;
      startLine -= 1;
    }

    return getSectionRange(cm, startLine);
  } else {
    // Go forward to find the last line of this section
    let numLines = cm.doc.lineCount()
      , checkLine = start
      , endLine = Infinity

    // FIXME: check if start is in section
    while (checkLine <= numLines) {
      if (!isInSection(cm, checkLine)) {
        endLine = checkLine;
        break;
      }
      checkLine += 1;
    }

    return [start, endLine]
  }
}


// For a given line number, return a list of all the unmarked references.
function getUnmarkedReferences(cm, line) {
  return cm.getLineTokens(line)
    .filter(isReferenceToken)
    .map(token => ({
      startPos: { line, ch: token.start },
      endPos: { line, ch: token.end },
      itemType: referenceTypeFromToken(token),
      itemID: token.string.match(/\d+/)[0]
    }))
    .filter(hasNotBeenMarked.bind(null, cm))
}


module.exports = {
  isReferenceToken,
  referenceTypeFromToken,
  hasNotBeenMarked,

  isInSection,
  getSectionRange,
  getUnmarkedReferences
}
