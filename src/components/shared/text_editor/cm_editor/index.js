"use strict";

var CodeMirror = require('codemirror')

require('./commands');
require('./en-markdown_mode');


module.exports = function (el, value='', {
  handleAddReference,
  getReferenceLabel,
  getInlineCitation,
  getFullCitation
}) {
  var actions = require('./actions')
    , editor

  editor = CodeMirror(el, {
    value,
    mode: 'en-markdown',
    lineWrapping: true,
    extraKeys: {
      'Enter': 'newlineAndIndentPromptForCitation'
    }
  });


  editor.getReferenceLabel = getReferenceLabel;
  editor.getInlineCitation = getInlineCitation;
  editor.getFullCitation = getFullCitation;
  editor.handleAddReference = handleAddReference;

  editor._sectionMarks = [];

  editor.on('inputRead', actions.checkEmptyReferences)
  editor.on('change', function (cm, { from, to }) {
    var fromLine = from.line
      , toLine = to.line

    actions.updateDocumentMarks(cm, fromLine, toLine);
  });

  editor.on('renderLine', function (cm, line) {
    var inCitationBlock = (
      line.markedSpans &&
      line.markedSpans.some(markedSpan =>
        editor._sectionMarks.indexOf(markedSpan.marker) !== -1)
    )

    if (inCitationBlock) {
      editor.addLineClass(line, 'text', 'CITATION-BLOCK');
    }
  });

  // Update references on editor initialization
  actions.updateDocumentMarks(editor, 0, editor.doc.lineCount() - 1);

  return editor;
}
