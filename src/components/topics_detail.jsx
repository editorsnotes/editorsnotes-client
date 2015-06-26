"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'TopicDetail',
  render: function () {
    var getLinks = require('../helpers/get_links')
      , topic = this.props.data
      , links = getLinks(topic)

    return (
      <div>
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
