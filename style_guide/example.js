var Immutable = require('immutable')

module.exports = [
  {
    Component: require('../src/components/main/header/component.jsx'),
    examples: [
      {
        title: 'A logged in user',
        props: {
          loading: false,
          user: Immutable.Map({
            url: '/',
            display_name: 'Patrick Golden'
          })
        }
      }
    ]
  },

  {
    Component: require('../src/components/shared/related_topic_selector/component.jsx'),
    examples: [
      {
        title: '',
        props: {
          topics: Immutable.Set([
            Immutable.Map({ id: 1, preferred_name: 'Emma Goldman' }),
            Immutable.Map({ id: 2, preferred_name: 'Alexander Berkman' })
          ])
        }
      }
    ]
  }
]
