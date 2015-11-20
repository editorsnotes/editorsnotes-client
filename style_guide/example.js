"use strict";

/* eslint camelcase:0 */

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
  },

  {
    Component: require('../src/components/shared/text_editor/component.jsx'),
    examples: [
      {
        title: 'Without reference box',
        props: {
          minimal: true,
          noCodeMirror: true,
          html: 'This line of text, this very line here, is precisely, no more and no less than, 94 characters.'
        }
      },

      {
        title: 'With reference box',
        props: {
          noCodeMirror: true,
          html: 'This line of text, this very line here, is precisely, no more and no less than, 94 characters.'
        }
      },

    ]
  },

  {
    Component: require('../src/components/shared/multiple_text_input/component.jsx'),
    examples: [
      {
        title: '',
        props: {
          values: Immutable.List(['first', 'second', 'third']),
          onValueAdded: () => null,
          onValueRemoved: () => null,
        }
      }
    ]
  },

  {
    Component: require('../src/components/main/notes_detail/information.jsx'),
    examples: [
      {
        title: '',
        props: {
          canReplace: () => false,
          note: Immutable.fromJS({
            title: 'A note',
            project: '#aproject',
            status: 'open',
            updaters: [
              '#anauthor',
              '#anotherauthor'
            ],
            related_topics: [],
            last_updated: 'December 3',
            license: {
              url: '#alicense',
              name: 'The license',
              symbols: 'c'
            },
            embedded: {
              '#aproject': {
                url: '#aproject',
                name: 'The Emma Goldman Papers'
              },
              '#anauthor': {
                url: '#anauthor',
                display_name: 'Patrick Golden'
              },
              '#anotherauthor': {
                url: '#anotherauthor',
                display_name: 'Ryan Shaw'
              }
            }
          }),
        }
      }
    ]
  },

  {
    Component: require('../src/components/shared/document_form/zotero_data.jsx'),
    examples: [
      {
        title: '',
        props: {
          data: Immutable.OrderedMap({
            itemType: 'book',
            title: 'Living My Life',
            creators: Immutable.List([
              Immutable.Map({ creatorType: 'author', firstName: 'Emma', lastName: 'Goldman' })
            ]),
            date: '1932'
          })
        }
      }
    ]
  },
]
