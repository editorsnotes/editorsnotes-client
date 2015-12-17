"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , titleCase = require('../../../utils/title_case')
  , Activity

Activity = ({ activityGroup }) => (
  <div>
    <h4 className="mb0">
      { activityGroup.get('count') > 1 && `(${activityGroup.get('count')}) ` }
      { titleCase(activityGroup.getIn(['mostRecent', 'action'])) }
      {' '}
      { activityGroup.getIn(['mostRecent', 'type']) }
    </h4>

    <div>
      <a href={activityGroup.getIn(['mostRecent', 'url'])}>
        { activityGroup.getIn(['mostRecent', 'title']) }
      </a>
    </div>

    <div>
      { new Date(activityGroup.get('times').first()).toLocaleString() }
    </div>


  </div>
)

module.exports = React.createClass({
  displayName: 'ActivityList',

  propTypes: {
    activities: React.PropTypes.instanceOf(Immutable.List)
  },

  renderAction(activity) {
    var label = `${titleCase(activity.get('action'))} ${activity.get('type')}`

    return (
      <div key={activity.get('time')}>
        <div><strong>{ label }</strong></div>
        <div><a href={activity.get('url')}>{ activity.get('title') }</a></div>
        <div>{ activity.get('time') }</div>
      </div>
    )
  },

  render() {
    var { groupActivities } = require('../../../helpers/activities')
      , { activities } = this.props
      , grouped = groupActivities(activities)

    debugger;

    return (
      <div>
      {
        groupActivities(activities).map(activityGroup =>
          <Activity
              key={activityGroup.get('id')}
              activityGroup={activityGroup} />
        )
      }
      </div>
    )
  }
});
