"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../../shared/translate.jsx')
  , strings = require('./strings')

function getName(creator) {
  return (
    creator.get('name') ||
    (creator.get('firstName', '') + ' ' + creator.get('lastName', '')).trim()
  )
}

const ZoteroCreatorField = ({ creator }) => (
  <tr>
    <td className="zotero-key border-right bold right-align px1" style={{ width: 90 }}>
      <Translate text={creator.get('creatorType')} domain="messages_zotero" />
    </td>
    <td>{getName(creator)}</td>
  </tr>
);

const ZoteroField = ({ value, field }) => (
  <tr>
    <td className="zotero-key border-right bold right-align px1" style={{ width: 90 }}>
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

function filterUnrenderedZoteroData(map) {
  var badKeys = ['tags', 'notes', 'relations', 'collections'];

  badKeys.forEach(key => { map = map.delete(key) });
  map = map.filter(val => val);

  if (map.has('creators')) {
    map = map.update('creators', creators => (
      creators.filter(creator => (
        creator.get('name') ||
        creator.get('firstName') ||
        creator.get('lastName')))))
  }

  return map;
}


function ZoteroDisplay({ data }) {
  return (
    <div className="mr3">
      {
        !data ?
          <p><Translate text={strings.noMetadata} /></p> :
          <div>
            <table
                className="ZoteroData table-light border rounded"
                style={{ tableLayout: 'fixed' }}>
              <tbody>
                {
                  filterUnrenderedZoteroData(data).map((value, field) =>
                    field !== 'creators' ?
                      <ZoteroField key={field} value={value} field={field} /> :
                      value.map((creator, i) =>
                        <ZoteroCreatorField key={`creator-${i}`} creator={creator} />
                      ).toArray()
                  ).toArray()
                }
              </tbody>
            </table>
          </div>
      }
    </div>
  )
}

ZoteroDisplay.propTypes = {
  data: React.PropTypes.instanceOf(Immutable.Map).isRequired
}


module.exports = ZoteroDisplay;
