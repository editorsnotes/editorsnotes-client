"use strict";

var React = require('react')
  , Translate = require('../shared/translate.jsx')

function getName(creator) {
  return (
    creator.get('name') ||
    (creator.get('firstName', '') + ' ' + creator.get('lastName', '')).trim()
  )
}

module.exports = React.createClass({
  displayName: 'ZoteroDisplay',
  renderZoteroField: function (value, field) {
    switch (field) {
    case 'tags':
      return null;
    case 'notes':
      return null;
    case 'creators':
      return value.map(creator => (
        <tr>
          <td className="zotero-key">
            <Translate
                text={creator.get('creatorType')}
                domain={'messages_zotero'} />
          </td>
          <td>{getName(creator)}</td>
        </tr>
      )).valueSeq();
    default:
      if (!value) return null
      return (
        <tr key={value}>
          <td className="zotero-key">
            <Translate text={field} domain={'messages_zotero'} />
          </td>
          <td>
            {
              field !== 'itemType' ?
                value :
                <Translate text={value} domain={'messages_zotero'} />
            }
          </td>
        </tr>
      )
    }
  },
  render: function () {
    var zoteroData = this.props.data;
    return (
      <div id="zotero">
        {
          !zoteroData ?
            <p>This document has no metadata.</p> :
            <div id="zotero-information">
              <table className="table table-striped table-condensed table-bordered">
                {zoteroData.map(this.renderZoteroField).valueSeq()}
              </table>
            </div>
        }
      </div>
    )
  }
});
