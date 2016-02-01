"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../../shared/translate.jsx')
  , strings = require('./strings')
  , commonStrings = require('../../common_strings')


function DocumentRelatedTopics({ topics }) {
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

DocumentRelatedTopics.propTypes = {
  topics: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = DocumentRelatedTopics;
