"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'RelatedTopicSelector',

  propTypes: {
    topics: React.PropTypes.instanceOf(Immutable.Set).isRequired
  },

  render: function () {
    return (
      <div className="related-topics-widget">

        <div className="related-topic-list">
          <input
              type="text"
              style={{ width: '350px' }}
              placeholder="Begin typing to search for topics." />
          {
            this.props.topics.map(topic =>
              <div key={topic.get('id')} className="related-topic">
                <a className="destroy" href="">
                  <i className="fa fa-minus-circle" />
                </a>
                {topic.get('preferred_name')}
              </div>
            )
          }
        </div>

      </div>
    )
  }
});
