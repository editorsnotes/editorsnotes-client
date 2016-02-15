"use strict";

var CodeMirror = require('codemirror')

require('codemirror/mode/markdown/markdown')

const TYPES = { n: 'note', d: 'document', t: 'topic' }
    , referenceRE = /^@@([ndt])?(\d+)?($|\W)/
    , citationRE = /^\[[^\]]*?@@d.*?\](?!\(.*\)|\[.*\])/
    , citationBlockRE = /^::: document @@d\d+$/


CodeMirror.defineMode('en-markdown', function (config) {
  var mdMode = CodeMirror.getMode(config, 'markdown')
    , mode

  mode = {
    startState: function () {
      var state = mdMode.startState();

      state.inCitation = false;
      state.inCitationBlock = false;

      return state;
    },

    copyState: function (s) {
      var state = mdMode.copyState(s);

      state.inCitation = s.inCitation;
      state.inCitationBlock = s.inCitationBlock;

      return state;
    },

    innerMode: function (state) {
      var innerMode = mdMode.innerMode(state);

      if (innerMode.mode === mdMode) {
        innerMode.mode = mode;
      }

      return innerMode;
    },

    blankLine: mdMode.blankLine,

    token: function (stream, state) {
      var token
        , reference

      if (!state.inCitationBlock && stream.match(citationBlockRE, true)) {
        state.inCitationBlock = true;
        return 'citationBlock-start';
      }

      if (state.inCitationBlock && stream.match(/^:::$/, true)) {
        state.inCitationBlock = false;
        return 'citationBlock-stop';
      }

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
            let match = stream.match(referenceRE, true);

            if (match) {
              let [,,id] = match;

              if (stream.current().slice(-1) === ']') stream.backUp(1);

              return id ? 'reference-document' : 'reference-empty-document';
            } else {
              stream.next(1);
            }
          }
        }
      }

      token = mdMode.token(stream, state)

      // If this is a citation, treat it that way
      if (stream.current() === '[') {
        stream.backUp(1);

        if (stream.match(citationRE, false)) {
          state.inCitation = true;
          stream.next(1);
          return 'citation-start';
        } else {
          stream.next(1);
        }
      }

      reference = stream.current().match(referenceRE);

      if (reference) {
        let [ type, id, trailing ] = reference.slice(1)

        // Skip if in link text
        stream.backUp(trailing.length);

        if (type) {
          return id ?
            `reference-${TYPES[type]}` :
            `reference-empty-${TYPES[type]}`
        }

        return 'reference-empty';
      }

      return token;
    }
  }

  return mode;
});
