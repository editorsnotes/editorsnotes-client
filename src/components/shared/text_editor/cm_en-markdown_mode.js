"use strict";

var CodeMirror = require('codemirror')

require('codemirror/mode/markdown/markdown')

const TYPES = { n: 'note', d: 'document', t: 'topic' }
    , referenceRegex = /^@@([ndt])?(\d+)?($|\W)/
    , citationRegex = /^\[[^\]]*?@@d.*?\](?!\(.*\)|\[.*\])/


CodeMirror.defineMode('en-markdown', function (config) {
  var mdMode = CodeMirror.getMode(config, 'markdown')

  return {
    startState: function () {
      var state = mdMode.startState();

      state.inCitation = false;
      state.inCitationBlock = false;

      return state;
    },

    token: function (stream, state) {
      var token
        , reference

      if (state.inCitation) {
        // Parse up to the first character which might indicate the start of a
        // new document being cited
        let skipUntil = stream.match(/^[@;\]]/)

        if (skipUntil) {
          let nextChar = skipUntil[0]

          if (nextChar === ']') {
            state.inCitation = false;
            return 'citation-end';
          }

          if (nextChar === '@') {
            stream.backUp(1);
            if (stream.match(referenceRegex, true)) {
              return 'reference-document';
            } else {
              stream.next(1);
            }
          }
        }
      }

      token = mdMode.token(stream, state)

      // If this is a citation, treat it that way
      if (token === '[') {
        stream.backUp(1);

        if (stream.match(citationRegex, false)) {
          state.inCitation = true;
          return 'citation-start';
        } else {
          stream.next(1);
        }
      }

      reference = stream.current().match(referenceRegex);

      if (reference) {
        let [ type, id, trailing ] = reference.slice(1)

        // Skip if in link text

        stream.backUp(trailing.length);

        /*
        if (type === 'd' && !id) {
          let isValidCitation = (
            state.thisLine &&
            state.thisLine.start > 0 &&
            state.thisLine.string[state.thisLine.start - 1] === '[' &&
            stream.peek() === ']'
          )
        }
        */

        if (type) {
          return id ?
            `reference-${TYPES[type]}` :
            `reference-empty-${TYPES[type]}`
        }

        return 'reference-empty';
      }

      return token;

      /*
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

      if (wordRegex.test(ch)) {
        let word
          , reference

        stream.eatWhile(wordRegex);

        word = stream.current();

      }
      */
    }
  }
});
