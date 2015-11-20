"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , ZoteroDisplay = require('./zotero_display.jsx')
  , Links = require('./links.jsx')
  , RelatedTopics = require('./related_topics.jsx')
  , Citations = require('./citations.jsx')
  , Scans = require('./scans.jsx')
  , Translate = require('../../shared/translate.jsx')
  , commonStrings = require('../../common_strings')
  , strings = require('./strings')

module.exports = React.createClass({
  displayName: 'DocumentDetail',

  renderBreadcrumb: function () {
    var Breadcrumb = require('../../shared/breadcrumb/component.jsx')
      , { getEmbedded } = require('../../../helpers/api')
      , doc = this.props.data
      , project = getEmbedded(doc, 'project')
      , crumbs

    crumbs = Immutable.List([
      Immutable.Map({ href: project.get('url'), label: project.get('name') }),
      Immutable.Map({
        href: project.get('url') + 'documents/',
        label: <Translate text={commonStrings.document} number={1} />
      }),
      Immutable.Map({ label: doc.get('description') })
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render: function () {
    var getLinks = require('../../../helpers/get_links')
      , { getEmbedded, getType, getDisplayTitle } = require('../../../helpers/api')
      , doc = this.props.data
      , links = getLinks(doc)

    return (
      <div>

        {this.renderBreadcrumb()}

        <header className="h1 mb2" dangerouslySetInnerHTML={{ __html: doc.get('description') }} />

        <section id="info">
          <h3>Metadata</h3>
          <ZoteroDisplay data={doc.get('zotero_data')} />
          <Links doc={doc} />
        </section>

        <div className="row edit-row">
          <div className="span5 edit-button">
            {
              !links.has('edit') ? '' :
                <a className="btn btn-primary" href={links.getIn(['edit', 'href']) + 'edit/'}>
                Edit
                </a>
            }
          </div>

          {/* FIXME
          <div className="span6 edit-history">
          Last edited
          </div>
          */ }
        </div>

          {/* FIXME
        <RelatedTopics topics={doc.get('related_topics')} />
        */}

        <h2>Referenced by</h2>
        {
          getEmbedded(doc, 'referenced_by').map(item =>
            <ul>
              <li>
                { getType(item) }:
                {' '}
                <a href={item.get('url')}>
                  { getDisplayTitle(item)}
                </a>
              </li>
            </ul>
          )
        }
        {/* FIXME <Citations citations={doc.get('cited_by')} /> */}

        <div>
          <h2><Translate text={strings.scans} /></h2>
          {
            doc.get('scans').size === 0 ?
              <Translate text={strings.noScans} /> :
              <Scans scans={doc.get('scans')} />
          }
        </div>
      </div>
    )
  }
});
