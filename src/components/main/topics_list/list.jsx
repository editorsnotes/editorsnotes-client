"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'TopicItemList',

  propTypes: {
    topic: React.PropTypes.instanceOf(Immutable.List)
  },

  render() {
    var { getDisplayTitle } = require('../../../helpers/api')
      , { topics } = this.props

    return (
      <div>
        {
          topics.map(topic =>
            <div key={topic.get('id')}>
              <h3>
                <a href={topic.get('url')}>
                  { getDisplayTitle(topic) }
                </a>
              </h3>
            </div>
          )
        }
      </div>
    )
  }
});
