"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'Note',

  renderBreadcrumb: function () {
    var Breadcrumb = require('../shared/breadcrumb/component.jsx')
      , note = this.props.data
      , project = note.get('project')
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') },
      { href: project.get('url') + 'notes/', label: 'Notes' },
      { label: note.get('title') }
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  renderMarkup: function () {
    return <div dangerouslySetInnerHTML={{ __html: this.props.data.get('markup_html') }} />

  },

  render: function () {
    var getLinks = require('../../helpers/get_links')
      , note = this.props.data
      , links = getLinks(note)

    return (
    <div id="note">

      {this.renderBreadcrumb()}

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

      <section>{ this.renderMarkup() }</section>

    </div>
    )
  }
});
