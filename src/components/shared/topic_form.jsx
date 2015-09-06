"use strict";

var React = require('react')
  , Topic = require('../../records/topic')

module.exports = React.createClass({
  displayName: 'TopicForm',

  propTypes: {
    topic: React.PropTypes.instanceOf(Topic).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    minimal: React.PropTypes.bool
  },

  getDefaultProps() {
    return { minimal: false }
  },

  handleAlternateNameAdded(name) {
    this.setState(prev => ({
      topic: prev.topic.update('alternate_names', names => names.add(name))
    }));
  },

  handleAlternateNameRemoved(name) {
    this.setState(prev =>({
      topic: prev.topic.update('alternate_names', names => names.delete(name))
    }))
  },

  mergeValues(value) {
    this.setState(prev => ({ topic: prev.topic.merge(value) }));
  },

  render() {
    var MultipleTextInput = require('./multiple_text_input.jsx')
      , RelatedTopicsSelector = require('./related_topic_selector.jsx')
      , HTMLEditor = require('./text_editor/index.jsx')
      , { topic } = this.props

    return (
      <div>
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

        {
          !this.props.minimal && (
            <section>
              <h3>Summary</h3>
              <HTMLEditor
                onChange={markup => this.handleValueChange({ markup })}
                html={topic.markup} />
              <br />
            </section>
          )
        }
      </div>
    )
  }
});
