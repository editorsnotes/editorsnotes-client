"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')
  , Topic

Topic = Immutable.Record({
  preferred_name: '',
  markup: '',
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
      , project = this.props.project || topic.get('project')
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') },
      { href: project.get('url') + 'topics/', label: 'Topics' },
    ]);

    crumbs = crumbs.concat(Immutable.fromJS(
      !topic ?
        [ { label: 'Add' } ] :
        [
          { href: topic.get('url'), label: topic.get('preferred_name') },
          { label: 'Edit' }
        ]
    ))

    return <Breadcrumb crumbs={crumbs} />
  },

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

  handleValueChange(value) {
    this.setState(prev => ({ topic: prev.topic.merge(value) }));
  },


  render: function () {
    var MultipleTextInput = require('../shared/multiple_text_input.jsx')
      , RelatedTopicsSelector = require('../shared/related_topic_selector.jsx')
      , HTMLEditor = require('../shared/text_editor/index.jsx')
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

        <section>
          <h3>Summary</h3>
          <HTMLEditor
            onChange={markup => this.handleValueChange({ markup })}
            html={topic.markup} />
          <br />
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
