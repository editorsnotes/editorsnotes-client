"use strict";

var CodeMirror = require('codemirror')

require('codemirror/mode/markdown/markdown')

CodeMirror.defineMode('en-markdown', function (config) {
  var enOverlay = {
    startState: function () {
      return { inDocumentBlock: false }
    },

    token: function (stream, state) {
      if (!state.inDocumentBlock && stream.match(/^::: document/, true)) {
        state.inDocumentBlock = true;
        stream.skipToEnd();
        return 'documentBlock-start';
      }

      if ((state.inDocumentBlock) && stream.match(/^:::/)) {
        state.inDocumentBlock = false;
        stream.skipToEnd();
        return 'documentBlock-stop';
      }

      stream.skipToEnd();
      return null;
    }
  }

  return CodeMirror.overlayMode(enOverlay, CodeMirror.getMode(config, 'markdown'));
});
