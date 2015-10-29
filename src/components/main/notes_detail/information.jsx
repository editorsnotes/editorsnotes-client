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
    var classnames = require('classnames')
      , { note, canReplace } = this.props
      , { getEmbedded } = require('../../../helpers/api')
      , project = getEmbedded(note, 'project')
      , updaters = getEmbedded(note, 'updaters')
      , license = note.get('license')
      , relatedTopics = note.get('related_topics')
      , dtClassName = 'NoteInformation--Heading absolute left bold'
      , ddClassName = 'NoteInformation--Item ml4'

    return (
      <div>
        <div className="clearfix mt3">
          <dl className="right col-4 p2 border rounded bg-lightgray">
            <dt className={dtClassName}>
              <Translate text={commonStrings.project} number={1} />
            </dt>
            <dd className={ddClassName}>
              <a href={project.get('url')}>
                { project.get('name') }
              </a>
            </dd>

            <dt className={dtClassName}>
              <Translate text={strings.status} />
            </dt>
            <dd className={ddClassName}>
              <span className={classnames('bold', {
                red: note.get('status') === 'closed',
                green: note.get('status') === 'open',
                yellow: note.get('status') === 'hibernating'
              })}>
                <Translate text={strings[note.get('status')]} />
              </span>
            </dd>

            <dt className={dtClassName}>
              <Translate text={strings.private} />
            </dt>
            <dd className={ddClassName}>
              <Translate text={note.get('is_private') ? 'Yes' : 'No'} />
            </dd>

            <dt className={dtClassName}>
              <Translate text={strings.license} />
            </dt>
            <dd className={ddClassName}>
              <a href={license.get('url')} title={license.get('name')}>
                {
                  license.get('symbols').split('').map(symbol =>
                    <i key={symbol}>{ symbol }</i>
                  )
                }
              </a>
            </dd>

            <dt className={dtClassName}>
              <Translate text={strings.author} number={updaters.size} />
            </dt>
            <dd className={ddClassName}>
              <ul className="m0 p0 list-reset">
                {
                  updaters.map(author =>
                    <li key={author}>
                      <a href={author.get('url')}>{author.get('display_name')}</a>
                    </li>
                  )
                }
              </ul>
            </dd>
          </dl>
          {/*
          <dl className="col col-6">

            <dt>
              <Translate text={commonStrings.relatedTopics} />
            </dt>

            <dd>
              <ul className="m0 p0">
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
            </dd>
          </dl>
          */}

          <div className="mb3">
            <h1 className="m0 mb1">{ note.get('title') }</h1>
            <p className="m0 muted">Created { note.get('created') }</p>
            <p className="m0 muted">Last updated { note.get('last_updated') }</p>
          </div>

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

      </div>
    )
  }
});
