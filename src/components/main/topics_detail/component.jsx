"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , HydraAware = require('../../util/hydra_aware.jsx')
  , TopicDetail

TopicDetail = React.createClass({
  displayName: 'TopicDetail',

  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    canReplace: React.PropTypes.func.isRequired
  },

  renderBreadcrumb: function () {
    var Breadcrumb = require('../../shared/breadcrumb/component.jsx')
      , { getEmbedded, getDisplayTitle } = require('../../../helpers/api')
      , topic = this.props.data
      , project = getEmbedded(topic, 'project')
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') },
      { href: project.get('url') + 'topics/', label: 'Topics' },
      { label: getDisplayTitle(topic) }
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render: function () {
    var { data, canReplace } = this.props
      , { getEmbedded, getType, getDisplayTitle } = require('../../../helpers/api')
      , { getWNGraph } = require('../../../helpers/topic')
      , wnTopic

    wnTopic = data
      .getIn(['wn_data', '@graph', '@graph'])
      .set('embedded', data.get('embedded'))

    return (
      <div>

        { this.renderBreadcrumb() }

        <h1>Topic: {wnTopic.get('preferred_name')}</h1>
        <p className="quiet">
          Last updated {data.get('last_updated')}
        </p>

        {
          canReplace() && (
            <div className="well">
              <a href="edit/" className="btn">Edit topic</a>
            </div>
          )
        }
        {
          !wnTopic.get('alternate_names').size ? null :
            <section>
              <h2>Alternate names</h2>
            </section>
        }

        {
          !wnTopic.get('related_topics').size ? null :
            <section>
              <h2>Related topics</h2>
            </section>
        }

        {
          !wnTopic.get('markup_html') ? null :
            <section>
              <h2>Summary</h2>
              <div dangerouslySetInnerHTML={{ __html: wnTopic.get('markup_html') }} />
            </section>
        }

        <h2>Referenced by</h2>
        <ul>
        {
          getEmbedded(data, 'referenced_by').map(item =>
              <li>
                { getType(item) }:
                {' '}
                <a href={item.get('url')}>
                  { getDisplayTitle(item) }
                </a>
              </li>
          )
        }
        </ul>


      </div>
    )
  }
});

module.exports = HydraAware(TopicDetail);
