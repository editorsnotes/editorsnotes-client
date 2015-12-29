"use strict";

var test = require('tape')
  , Immutable = require('immutable')

test('Activities helpers', function (t) {
  var activitiesHelpers = require('../helpers/activities')
    , activitiesData = require('./fixtures/activity_list.json')

  activitiesData = Immutable.fromJS(activitiesData)

  t.plan(1)

  t.deepEqual(
    activitiesHelpers.groupActivities(activitiesData).toJS(),
    [
      {
        count: 2,
        id: "changed|/projects/patrick_research/notes/17/",
        mostRecent: {
          "user": "patrick",
          "project": "patrick_research",
          "time": "2015-09-28T14:30:59.277143",
          "type": "note",
          "url": "/projects/patrick_research/notes/17/",
          "title": "My first note",
          "action": "changed"
        },
        times: ["2015-09-28T14:30:59.277143", "2015-09-28T14:30:03.566247"]
      },
      {
        count: 1,
        id: "added|/projects/patrick_research/topics/8/",
        mostRecent: {
          "user": "p",
          "project": "patrick_research",
          "time": "2015-09-28T11:29:53.710729",
          "type": "topic",
          "url": "/projects/patrick_research/topics/8/",
          "title": "DSflkjasd",
          "action": "added"
        },
        times: ["2015-09-28T11:29:53.710729"]
      },
      {
        count: 1,
        id: "added|/projects/patrick_research/notes/17/",
        mostRecent: {
          "user": "p",
          "project": "patrick_research",
          "time": "2015-09-28T14:29:48.158976",
          "type": "note",
          "url": "/projects/patrick_research/notes/17/",
          "title": "My first note",
          "action": "added"
        },
        times: ["2015-09-28T14:29:48.158976"]
      }
    ]
  )
});
