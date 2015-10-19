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
      , { getEmbedded } = require('../../../helpers/api')
      , topic = this.props.data
      , project = getEmbedded(topic, 'project')
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') },
      { href: project.get('url') + 'topics/', label: 'Topics' },
      { label: topic.get('preferred_name') }
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render: function () {
    var { data, canReplace } = this.props
      , { getEmbedded, getType, getDisplayTitle } = require('../../../helpers/api')
      , topic = data

    return (
      <div>

        {this.renderBreadcrumb()}

        <h1>Topic: {topic.get('preferred_name')}</h1>
        <p className="quiet">
          Last updated {topic.get('last_updated')}
        </p>

        {
          canReplace() && (
            <div className="well">
              <a href="edit/" className="btn">Edit topic</a>
            </div>
          )
        }
        {
          !topic.get('alternate_names').size ? null :
            <section>
              <h2>Alternate names</h2>
            </section>
        }

        {
          !topic.get('related_topics').size ? null :
            <section>
              <h2>Related topics</h2>
            </section>
        }

        {
          !topic.get('markup_html') ? null :
            <section>
              <h2>Summary</h2>
              <div dangerouslySetInnerHTML={{ __html: topic.get('markup_html') }} />
            </section>
        }

        <h2>Referenced by</h2>
        <ul>
        {
          getEmbedded(topic, 'referenced_by').map(item =>
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
