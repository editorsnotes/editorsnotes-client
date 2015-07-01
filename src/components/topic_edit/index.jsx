"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')
  , Topic

Topic = Immutable.Record({
  preferred_name: '',
  summary: '',
  alternate_names: Immutable.List(),
  related_topics: Immutable.List()
});

module.exports = React.createClass({
  displayName: 'TopicEdit',

  getInitialState: function () {
    return { topic: new Topic(this.props.data) }
  },

  renderBreadcrumb: function () {
    var Breadcrumb = require('../shared/breadcrumb.jsx')
      , topic = this.props.data
      , project = topic.get('project')
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') },
      { href: project.get('url') + 'topics/', label: 'Topics' },
      { href: topic.get('url'), label: topic.get('preferred_name') },
      { label: 'Edit' }
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },
/*
  getValue: function () {
    return this.state.topic
      .set('content', this.refs.content.getValue())
      .update('related_topics', topics => topics.map(topic => topic.get('url')))
      .update('license', license => license.get('url'))
  },

  handleAddSection(index, section) {
    console.log(section.toJS(), index);
  },

  handleChange: function (e) {
    var field = e.target.name
      , value = e.target.value

    if (field === 'is_private') {
      value = value === 'true' ? true : false;
    }

    this.setState(prev => ({ topic: prev.topic.set(field, value) }));
  },

  handleSave: function () {
    var topic = this.getValue()

    console.log(topic.toJS());
  },
*/
  handleAlternateNameAdded: function (name) {
    this.setState(prev =>
      ({ topic: prev.topic.update('alternate_names',
        names => names.push(name)) }))
  },

  handleAlternateNameRemoved: function (name) {
    this.setState(prev =>
      ({ topic: prev.topic.update('alternate_names',
        names => names.delete(names.indexOf(name))) }))
  },

  render: function () {
    var MultipleTextInput = require('../shared/multiple_text_input.jsx')
      , RelatedTopicsSelector = require('../shared/related_topic_selector.jsx')
      , HTMLEditor = require('../shared/text_editor.jsx')
      , topic = this.state.topic

    return (
      <div>
        {this.renderBreadcrumb()}
        <header>
          <h3>Preferred name</h3>
          <div data-error-target="title"></div>
          <input
              id="topic-preferred-name"
              name="preferred-name"
              maxLength="80"
              type="text"
              value={topic.preferred_name}
              onChange={this.handleChange} />
        </header>

        <section id="topic-alternate-names">
          <h3>Alternate names</h3>
          <MultipleTextInput
            values={topic.get('alternate_names').toList()}
            onValueAdded={this.handleAlternateNameAdded}
            onValueRemoved={this.handleAlternateNameRemoved}
          />
        </section>

        <section id="topic-related-topics">
          <h3>Related topics</h3>
          <RelatedTopicsSelector
            topics={topic.get('related_topics').toSet()} />
        </section>

        <section id="topic-summary">
          <h3>Summary</h3>
          <HTMLEditor
              ref="summary"
              style={{
                height: '200px',
                width: '99%',
                padding: '4px 6px',
                border: '1px solid rgb(204, 204, 204)',
                borderRadius: '4px'
              }}
              html={topic.summary} />
        </section>

        <section>
          <div className="well">
            <button className="btn btn-primary btn-large"
              onClick={this.handleSave}>Save</button>
          </div>
        </section>

      </div>
    )
  }
});
