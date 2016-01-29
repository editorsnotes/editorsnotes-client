"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , { getType, getDisplayTitle } = require('../../../helpers/api')
  , References

References = ({ embeddedItems }) => (
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

References.propTypes = {
  embeddedItems: React.PropTypes.instanceOf(Immutable.Set).isRequired
}

module.exports = References;
