"use strict";

var React = require('react')
  , NoteSection = require('./note_section')

module.exports = React.createClass({
  displayName: 'Note',
  render: function () {
    var getLinks = require('../helpers/get_links')
      , note = this.props.data
      , links = getLinks(note)

    return (
    <div id="note">
      <header><h2>{note.get('title')}</h2></header>
      <section id="note-details">
        <div id="note-about">

          <div>
            <strong>This note is </strong>
            <span className={'note-status-' + note.get('status')}>
              {note.get('status')}
            </span>
          </div>

          <div id="note-related-topics">
            <span>Related topics</span>
            <ul className="unstyled">
              {
                !note.get('related_topics').size ?
                  <span className="quiet">none</span> :
                  note.get('related_topics').map(topic =>
                    <li key={topic.get('url')}>
                      <a href={topic.get('url')}>{topic.get('preferred_name')}</a>
                    </li>
                  )
              }
            </ul>
          </div>
        </div>

        <dl id="note-authorship" className="dl-horizontal">
          <dt>Project</dt>
          <dd>
            <a href={note.getIn(['project, url'])}>
              {note.getIn(['project', 'name'])}
            </a>
          </dd>

          <dt>Private</dt>
          <dd>
            {note.get('is_private') ? 'Yes' : 'No'}
          </dd>

          <dt>License</dt>
          <dd>
            <a className="license-link"
                href={note.getIn(['license', 'url'])}
                title={note.getIn(['license', 'name'])}>
                {
                  note.getIn(['license', 'symbols']).split('').map(symbol =>
                    <i key={symbol} className="license-symbol">{symbol}</i>
                  )
                }
            </a>
          </dd>

          <dt>{note.get('updaters').size > 1 ? 'Authors' : 'Author'}</dt>
          <dd>
            <ul className="unstyled">
              {
                note.get('updaters').map(author =>
                  <li key={author}><a href={author.get('url')}>{author.get('display_name')}</a></li>
                )
              }
            </ul>
          </dd>

          <dt>Last updated</dt>
          <dd>{note.get('last_updated')} <a href="#">View history</a></dd>

        </dl>

        {
          !links.has('edit') ? '' :
            <div className="row">
              <div
                  className="span12 container"
                  style={{ textAlign: 'center', paddingTop: '19px', borderTop: '1px solid #ddd' }}>
                <a href={note.get('url') + 'edit/'} className="btn btn-default">Edit note</a>
              </div>
            </div>
        }
      </section>

      <section id="note-description" dangerouslySetInnerHTML={{ __html: note.get('content') }} />

      <section id="note-sections">
        {note.get('sections').map(section =>
          <NoteSection key={section.get('section_id')} section={section} />
        )}
      </section>

    </div>
    )
  }
});
