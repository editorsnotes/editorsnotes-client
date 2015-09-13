"use strict";

var React = require('react')
  , Translate = require('../shared/translate.jsx')
  , strings = require('./strings')
  , commonStrings = require('../common_strings')

module.exports = React.createClass({
  displayName: 'DocumentRelatedTopics',

  render: function () {
    var { topics } = this.props

    return (
      <div>
          <h2><Translate text={commonStrings.relatedTopics} /></h2>
          <div className="related-topics">
            {
              topics.size === 0 ?
                <p><Translate text={strings.noRelatedTopics} /></p> :
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
