"use strict";

var React = require('react')
  , ZoteroDisplay = require('./zotero_display.jsx')
  , Links = require('./links.jsx')
  , RelatedTopics = require('./related_topics.jsx')
  , Citations = require('./citations.jsx')
  , Scans = require('./scans.jsx')

module.exports = React.createClass({
  displayName: 'DocumentDetail',
  render: function () {
    var getLinks = require('../../helpers/get_links')
      , doc = this.props.data
      , links = getLinks(doc)

    return (
      <div>
        <header dangerouslySetInnerHTML={{ __html: doc.get('description') }} />

        <section id="info">
          <ZoteroDisplay i18n={this.props.i18n} data={doc.get('zotero_data')} />
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
