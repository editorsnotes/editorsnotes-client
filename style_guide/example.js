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
  },

  {
    Component: require('../src/components/shared/breadcrumb/component.jsx'),
    examples: [
      {
        title: '',
        props: {
          crumbs: Immutable.List([
            Immutable.Map({ label: 'First', href: '#' }),
            Immutable.Map({ label: 'Second', href: '#' }),
            Immutable.Map({ label: 'A very ' + 'long, '.repeat(20) + 'title', href: '#' }),
          ])
        }
      }
    ]
  },

  {
    Component: require('../src/components/shared/field_errors.jsx'),
    examples: [
      {
        title: '',
        props: {
          errors: Immutable.List([
            'First error',
            'Second error'
          ])
        }
      }
    ]
  }
]
