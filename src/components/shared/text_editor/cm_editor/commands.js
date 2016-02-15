"use strict";

var CodeMirror = require('codemirror')

require('codemirror/addon/edit/continuelist');


CodeMirror.commands.newlineAndIndentPromptForCitation = function (cm) {
  if (cm.getOption("disableInput")) return CodeMirror.Pass;

  var lastRange = cm.listSelections().slice(-1)[0]
    , lastLine = lastRange.head.line
    , eolState = cm.getStateAfter(lastLine)
    , wasInQuote = eolState.quote !== 0
    , hasCitation = cm.getLineTokens(lastLine).map(t => t.type).some(t => t === 'citation-start')
    , indent
    , quotes
    , after
    , noLongerInQuote

  if (wasInQuote && hasCitation) {
    cm.replaceSelection('\n\n');
    return null;
  }

  if (wasInQuote) {
    let match = /^(\s*)(>+)(\s*)/.exec(cm.getLine(lastLine));
    [, indent, quotes, after] = match;
  }

  // Check if we are at the end of a citation block
  let citationBlockEnd = cm.findMarksAt({ line: lastLine + 1 })
    .filter(mark => mark.className === 'CITATION-BLOCK-END' && mark.atomic)

  if (
      citationBlockEnd.length &&
      !cm.getLine(lastLine - 1).trim() &&
      !cm.getLine(lastLine - 2).trim()
  ) {
    let pos = {
      line: lastLine + 1,
      ch: cm.getLine(lastLine + 1).length - 1
    }

    citationBlockEnd = citationBlockEnd[0];
    citationBlockEnd.inclusiveRight = false;

    cm.setSelection(pos);
    CodeMirror.commands.newlineAndIndent(cm);

    citationBlockEnd.inclusiveRight = true;

    return null;
  }

  CodeMirror.commands.newlineAndIndentContinueMarkdownList(cm);

  noLongerInQuote = cm.getStateAfter(cm.getCursor().line).quote === 0;

  // This means we have a newline
  if (wasInQuote && noLongerInQuote) {
    let actions = require('./actions')
      , pos = cm.getCursor()
      , prev = { line: pos.line - 1, ch: 0 }

    cm.setSelection(prev, pos);

    if (cm.getStateAfter(prev.line).inCitationBlock) {
      cm.replaceSelection(
        indent + quotes + after + '\n' +
        indent + quotes + after + '['
      );
      cm.replaceSelection(']', 'start');
    } else {
      cm.replaceSelection(
        indent + quotes + after + '\n' +
        indent + quotes + after + '[@@d'
      );
      cm.replaceSelection(']', 'start');
      actions.checkEmptyReferences(cm, { to: cm.getCursor(), text: 'd' });
    }

    return null;
  }
}
