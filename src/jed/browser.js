"use strict";

/* eslint camelcase:0 */
/* global requirePo */

module.exports = function () {
  var Jed = require('jed')
    , main = requirePo('../../locale/%s/LC_MESSAGES/main.po')
    , zotero = requirePo('../../locale/%s/LC_MESSAGES/zotero.po')
    , locale_data

  function processPoData(data) {
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) data[key].shift()
    });

    return data;
  }

  locale_data = {
    'messages_main': processPoData(main.options.locale_data.messages),
    'messages_zotero': processPoData(zotero.options.locale_data.messages)
  }

  return new Jed({ domain: 'messages_main', locale_data });
}

