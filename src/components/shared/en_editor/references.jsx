"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')


function ReferenceHint({ embeddedItems }) {
  var { getType, getDisplayTitle } = require('../../../helpers/api')
    , { embeddedItems } = this.props

  return (
    <ul className="list-reset">
    {
      embeddedItems.map(item =>
        <li key={item.get('url')}>
          <strong
              className="inline-block right-align mr1"
              style={{ width: '76px' }}>
            { getType(item) }:
          </strong>
          <a
              href={item.get('url')}
              target="blank"
              className="inline inline-children"
              dangerouslySetInnerHTML={{ __html: getDisplayTitle(item) }} />
        </li>
      )
    }
    </ul>
  )
}

ReferenceHint.propTypes = {
  embeddedItems: React.PropTypes.instanceOf(Immutable.Set).isRequired,
}

module.exports = ReferenceHint;
