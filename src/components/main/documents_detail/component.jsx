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
  , { connect } = require('react-redux')

const DocumentDetail = React.createClass({
  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map).isRequired
  },

  renderBreadcrumb: function () {
    var Breadcrumb = require('../../shared/breadcrumb/component.jsx')
      , { getEmbedded } = require('../../../helpers/api')
      , { data } = this.props
      , project = getEmbedded(data, 'project')
      , crumbs

    crumbs = Immutable.List([
      Immutable.Map({ href: project.get('url'), label: project.get('name') }),
      Immutable.Map({
        href: project.get('url') + 'documents/',
        label: <Translate text={commonStrings.document} number={1} />
      }),
      Immutable.Map({ label: data.get('description') })
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render: function () {
    var getLinks = require('../../../helpers/get_links')
      , { getEmbedded, getType, getDisplayTitle } = require('../../../helpers/api')
      , { data } = this.props
      , links = getLinks(data)

    return (
      <div>

        {this.renderBreadcrumb()}

        <header className="h1 mb2" dangerouslySetInnerHTML={{ __html: data.get('description') }} />

        <section>

          <div className="clearfix">
            <div className="col col-6">
              <h2>Metadata</h2>
              <ZoteroDisplay data={data.get('zotero_data')} />
            </div>
            <div className="col col-6">
              <h2>Referenced by</h2>
              { !data.get('referenced_by').size && <p><em>No references to this document.</em></p> }
              <ul className="list-reset">
                {
                  getEmbedded(data, 'referenced_by').map(item =>
                    <li key={item.hashCode()}>
                      { getType(item) }:
                      {' '}
                      <a href={item.get('url')}>
                        { getDisplayTitle(item)}
                      </a>
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
          <Links doc={data} />
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
        <RelatedTopics topics={data.get('related_topics')} />
        */}

        {/* FIXME <Citations doc={data} citations={data.get('cited_by')} /> */}

        <div>
          <h2><Translate text={strings.scans} /></h2>
          {
            data.get('scans').size === 0 ?
              <Translate text={strings.noScans} /> :
              <Scans scans={data.get('scans')} />
          }
        </div>
      </div>
    )
  }
});

module.exports = connect(require('../default_api_mapper'))(DocumentDetail);
