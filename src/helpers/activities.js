"use strict";

var Immutable = require('immutable')

function activityURLAndAction(activity) {
  return `${activity.get('action')}|${activity.get('url')}`
}

function groupActivities(activities) {
  return activities
    .groupBy(activityURLAndAction)
    .toList()
    .sortBy(activitiesForURL => activities.indexOf(activitiesForURL.first()))
    .map(activitiesForURL => Immutable.Map({
      id: activityURLAndAction(activitiesForURL.first()),
      count: activitiesForURL.size,
      mostRecent: activitiesForURL.first(),
      times: activitiesForURL.map(activity => activity.get('time'))
    }))
}

module.exports = { groupActivities }
