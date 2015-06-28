"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'DocumentRelatedTopics',
  render: function () {
    var topics = this.props.topics;
    return (
      <div>
          <h2>Related topics</h2>
          <div className="related-topics">
            {
              topics.size === 0 ?
                <p>There are no topics related to this document.</p> :
                topics.map(topic =>
                  <li key={topic.hashCode()}>
                    <a href={topic.get('url')}>{topic.get('preferred_name')}</a>
                  </li>
                )
            }
          </div>
      </div>
    )
  }
});
