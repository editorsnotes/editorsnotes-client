"use strict";

var CodeMirror = require('codemirror')

require('codemirror/mode/markdown/markdown')

const TYPES = { n: 'note', d: 'document', t: 'topic' }

CodeMirror.defineMode('en-markdown', function (config) {
  var wordRegex = /[@\w$\xa1-\uffff]/
    , referenceRegex = /^@@([ndt])?(\d+)?$/
    , enOverlay


  enOverlay = {
    startState: function () {
      return { inDocumentBlock: false }
    },

    token: function (stream, state) {
      var ch

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

      ch = stream.next();

      if (wordRegex.test(ch)) {
        let word
          , reference

        stream.eatWhile(wordRegex);

        word = stream.current();

        reference = word.match(referenceRegex)

        if (reference) {
          let [type, id] = reference.slice(1)

          if (type) {
            let typeLabel = TYPES[type]

            if (id) {
              return `reference-${typeLabel}`;
            }

            return `reference-empty-${typeLabel}`;
          }

          return 'reference-empty';
        }
      }
    }
  }

  return CodeMirror.overlayMode(enOverlay, CodeMirror.getMode(config, 'markdown'));
});
