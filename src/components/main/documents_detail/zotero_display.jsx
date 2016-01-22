"use strict";

var React = require('react')
  , Translate = require('../../shared/translate.jsx')
  , strings = require('./strings')

function getName(creator) {
  return (
    creator.get('name') ||
    (creator.get('firstName', '') + ' ' + creator.get('lastName', '')).trim()
  )
}

function ZoteroField({ value, field }) {
  switch (field) {
  case 'tags':
  case 'notes':
  case 'relations':
  case 'collections':
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
}


function ZoteroDisplay({ data }) {
  return (
    <div>
      {
        !data ?
          <p><Translate text={strings.noMetadata} /></p> :
          <div>
            <table>
              {
                data.map((value, field) =>
                  <ZoteroField value={value} field={field} />
                ).toArray()
              }
            </table>
          </div>
      }
    </div>
  )
}

ZoteroDisplay.propTypes = {
  data: React.propTypes
}


module.exports = ZoteroDisplay;
