"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , titleCase = require('../../../utils/title_case')

module.exports = React.createClass({
  displayName: 'ActivityList',

  propTypes: {
    activities: React.PropTypes.instanceOf(Immutable.List)
  },

  renderAction(activity) {
    var label = `${titleCase(activity.get('action'))} ${activity.get('type')}`

    return (
      <p key={activity.get('time')}>
        <div><strong>{ label }</strong></div>
        <div><a href={activity.get('url')}>{ activity.get('title') }</a></div>
        <div>{ activity.get('time') }</div>
      </p>
    )
  },

  render() {
    var { activities } = this.props

    return activities.size > 0 && (
      <div>
        { activities.map(this.renderAction) }
      </div>
    )
  }
});
