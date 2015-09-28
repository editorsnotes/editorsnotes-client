"use strict";

var React = require('react')
  , Translate = require('../../shared/translate.jsx')
  , commonStrings = require('../../common_strings')
  , strings = require('./strings')

module.exports = React.createClass({
  displayName: 'DocumentCitations',
  render: function () {
    var { citations } = this.props

    return (
      <div>
        <h2>Cited by</h2>
        {
          citations.size === 0 ?
            <p>
              <Translate text={strings.noCitations} />
            </p> :
            <ul>
              citations.map(citation =>
                <li key={citation.hashCode()}>
                  <Translate text={commonStrings[citation.get('item_type')]} />
                  ': '
                  <a href={citation.get('item_url')}>
                    { citation.get('item_name') }
                  </a>
                  {
                    !citation.get('content') ? '' :
                      <p dangerouslySetInnerHTML={{ __html: citation.get('content') }} />
                  }
                </li>
              )
            </ul>
        }
      </div>
    )
  }
});
