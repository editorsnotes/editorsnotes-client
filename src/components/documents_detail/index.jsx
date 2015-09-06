"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , ZoteroDisplay = require('./zotero_display.jsx')
  , Links = require('./links.jsx')
  , RelatedTopics = require('./related_topics.jsx')
  , Citations = require('./citations.jsx')
  , Scans = require('./scans.jsx')

module.exports = React.createClass({
  displayName: 'DocumentDetail',

  renderBreadcrumb: function () {
    var Breadcrumb = require('../shared/breadcrumb.jsx')
      , doc = this.props.data
      , project = doc.get('project')
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') },
      { href: project.get('url') + 'documents/', label: 'Documents' },
      { label: doc.get('description') }
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render: function () {
    var getLinks = require('../../helpers/get_links')
      , doc = this.props.data
      , links = getLinks(doc)

    return (
      <div>

        {this.renderBreadcrumb()}

        <header dangerouslySetInnerHTML={{ __html: doc.get('description') }} />

        <section id="info">
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
          <div className="span6 edit-history">
          Last edited
          {/* FIXME: last edited */}
          </div>
        </div>

        <RelatedTopics topics={doc.get('related_topics')} />

        <Citations citations={doc.get('cited_by')} />

        <Scans scans={doc.get('scans')} />
      </div>
    )
  }
});
