"use strict";

var CodeMirror = require('codemirror')


// Register CodeMirror modes for our markup
require('codemirror/mode/gfm/gfm');
require('./cm_en-markdown_mode');


module.exports = function (el, value='', opts={}) {
  var actions = require('./cm_actions')
    , editor

  editor = CodeMirror(el, {
    value,
    mode: 'en-markdown',
    lineWrapping: true
  });

  Object.keys(opts).forEach(key => {
    editor[key] = opts[key];
  })

  editor.on('inputRead', actions.checkEmptyReferences)
  editor.on('change', function (cm, { from, to }) {
    var fromLine = from.line
      , toLine = to.line

    //actions.updateDocumentMarks(cm, fromLine, toLine);
    actions.updateInlineReferences(cm, fromLine, toLine);
  });

  // Update references on editor initialization
  actions.updateInlineReferences(editor, 0, editor.doc.lineCount() - 1);

  return editor;
}
