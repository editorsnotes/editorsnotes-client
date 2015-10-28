"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../../shared/translate.jsx')
  , strings = require('./strings')
  , commonStrings = require('../../common_strings')


module.exports = React.createClass({
  displayName: 'NoteInformation',

  propTypes: {
    canReplace: React.PropTypes.func.isRequired,
    note: React.PropTypes.instanceOf(Immutable.Map).isRequired
  },

  render() {
    var { note, canReplace } = this.props
      , { getEmbedded } = require('../../../helpers/api')
      , project = getEmbedded(note, 'project')
      , updaters = getEmbedded(note, 'updaters')
      , license = note.get('license')
      , relatedTopics = note.get('related_topics')

    return (
      <div>
        <div>
          <div>
            <Translate text={strings.status} />
            <Translate text={strings[note.get('status')]} />
          </div>

          <div>
            <Translate text={commonStrings.relatedTopics} />
            <ul>
              {
                !relatedTopics.size ?
                  <Translate text={strings.noRelatedTopics} /> :
                  relatedTopics.map(topic =>
                    <li key={topic.get('url')}>
                      <a href={topic.get('url')}>
                        { topic.get('preferred_name') }
                      </a>
                    </li>
                  )
              }
            </ul>
          </div>
        </div>

        <dl>
          <dt>
            <Translate text={commonStrings.project} number={1} />
          </dt>
          <dd>
            <a href={project.get('url')}>
              { project.get('name') }
            </a>
          </dd>

          <dt>
            <Translate text={strings.private} />
          </dt>
          <dd>
            <Translate text={note.get('is_private') ? 'Yes' : 'No'} />
          </dd>

          <dt>
            <Translate text={strings.license} />
          </dt>
          <dd>
            <a href={license.get('url')} title={license.get('name')}>
              {
                license.get('symbols').split('').map(symbol =>
                  <i key={symbol}>{ symbol }</i>
                )
              }
            </a>
          </dd>

          <dt>
            <Translate text={strings.author} number={updaters.size} />
          </dt>
          <dd>
            <ul>
              {
                updaters.map(author =>
                  <li key={author}>
                    <a href={author.get('url')}>{author.get('display_name')}</a>
                  </li>
                )
              }
            </ul>
          </dd>

          <dt>
            <Translate text={commonStrings.lastUpdated} />
          </dt>
          <dd>
            { note.get('last_updated') }
            {/* <a href="#">View history</a> */}
          </dd>

        </dl>

        {
          canReplace() && (
            <div>
              <a href={note.get('url') + 'edit/'} className="btn btn-primary">
                <Translate text={commonStrings.edit} />
              </a>
            </div>
          )
        }
      </div>
    )
  }
});
