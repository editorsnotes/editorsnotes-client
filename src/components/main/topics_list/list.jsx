"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'TopicItemList',

  propTypes: {
    topic: React.PropTypes.instanceOf(Immutable.List)
  },

  render() {
    var { topics } = this.props

    return (
      <div>
        {
          topics.map(topic =>
            <div key={topic.get('id')}>
              <h3>
                <a href={topic.get('url')}>
                  { topic.get('preferred_name') }
                </a>
              </h3>
            </div>
          )
        }
      </div>
    )
  }
});
