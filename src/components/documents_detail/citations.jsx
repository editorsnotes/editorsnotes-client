"use strict";

var React = require('react')

function title(str) {
  return str[0].toUpperCase() + str.slice(1);
}

module.exports = React.createClass({
  displayName: 'DocumentCitations',
  render: function () {
    var citations = this.props.citations

    return (
      <div>
        <h2>Cited by</h2>
        <ul>
        {
          citations.size === 0 ?
            <p>This topic has not been cited.</p> :
            citations.map(citation =>
              <li key={citation.hashCode()}>
                {title(citation.get('item_type'))}: <a href={citation.get('item_url')}>
                  {citation.get('item_name')}
                </a>
                {
                  !citation.get('content') ? '' :
                    <p dangerouslySetInnerHTML={{ __html: citation.get('content') }} />
                }
              </li>
            )
        }
        </ul>
      </div>
    )
  }
});
