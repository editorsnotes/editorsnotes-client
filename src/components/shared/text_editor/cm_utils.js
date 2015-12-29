"use strict";

function isReferenceToken(token) {
  return (
    (token.type || '').indexOf('reference-') === 0 &&
    token.type.indexOf('empty') === -1
  )
}

function isCitationBlockToken(token) {
  return (token.type || '').indexOf('citationBlock-start') === 0;
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


// Given a line number, return the next token that ends a citation block
function getClosingBlockToken(cm, startLine) {
  var numLines = cm.doc.lineCount()
    , checkLine = startLine
    , closingToken = null

  while (checkLine <= numLines) {
    let closingTokens = cm
      .getLineTokens(checkLine, true)
      .filter(token => (token.type || '').indexOf('citationBlock-stop') !== -1)

    if (closingTokens.length) {
      closingToken = closingTokens[0];
      break;
    }

    checkLine += 1;
  }

  return closingToken && {
    startPos: { line: checkLine, ch: closingToken.start },
    endPos: { line: checkLine, ch: closingToken.end }
  }
}


// For a given line number, return a list of all the unmarked references.
function getUnmarkedReferences(cm, line) {
  return cm.getLineTokens(line)
    .filter(token => isReferenceToken(token) || isCitationBlockToken(token))
    .map(token => ({
      token,
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

  getUnmarkedReferences,
  getClosingBlockToken
}
