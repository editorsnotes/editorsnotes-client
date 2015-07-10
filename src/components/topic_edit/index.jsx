"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'TopicEdit',

  getInitialState: function () {
    var Topic = require('../../records/topic')
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

  handleValueChange(value) {
    this.setState(prev => ({ topic: prev.topic.merge(value) }));
  },

  handleChange: function (e) {
    var field = e.target.name
      , value = e.target.value
    this.setState(prev => ({ topic: prev.topic.set(field, value) }));
  },

  handleSave: function () {
    console.log(this.state.topic.toJS());
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
              name="preferred_name"
              maxLength="80"
              type="text"
              value={topic.preferred_name}
              onChange={this.handleChange} />
        </header>

        <section id="topic-alternate-names">
          <h3>Alternate names</h3>
          <MultipleTextInput
            onChange={alternate_names =>
                      this.handleValueChange({ alternate_names })}
            values={topic.get('alternate_names').toList()}
          />
        </section>

        <section id="topic-related-topics">
          <h3>Related topics</h3>
          <RelatedTopicsSelector
            onChange={related_topics =>
                      this.handleValueChange({ related_topics })}
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
              onChange={summary => this.handleValueChange({ summary })}
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
