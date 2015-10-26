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
      <div>
        <input
            type="text"
            className="field mb1"
            style={{ width: '350px' }}
            placeholder="Begin typing to search for topics." />
        {
          this.props.topics.map(topic =>
            <div key={topic.get('url')}>
              <a href="">
                <i className="fa fa-minus-circle mr1" />
              </a>
              { topic.get('preferred_name') }
            </div>
          )
        }
      </div>
    )
  }
});
