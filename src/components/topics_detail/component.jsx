"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'TopicDetail',

  renderBreadcrumb: function () {
    var Breadcrumb = require('../shared/breadcrumb/component.jsx')
      , topic = this.props.data
      , project = topic.get('project')
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') },
      { href: project.get('url') + 'topics/', label: 'Topics' },
      { label: topic.get('preferred_name') }
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render: function () {
    var getLinks = require('../../helpers/get_links')
      , topic = this.props.data
      , links = getLinks(topic)

    return (
      <div>

        {this.renderBreadcrumb()}

        <h1>Topic: {topic.get('preferred_name')}</h1>
        <p className="quiet">
          Last updated {topic.get('last_updated')}
        </p>

        {
          !links.has('edit') ? null :
            <div className="well">
              <btn className="btn">Edit topic</btn>
            </div>
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
          !topic.get('summary') ? null :
            <section>
              <h2>Summary</h2>
              <div dangerouslySetInnerHTML={{ __html: topic.get('summary') }} />
            </section>
        }

      </div>
    )
  }
});
