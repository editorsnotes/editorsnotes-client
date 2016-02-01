"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Topic = require('../../../records/topic')

module.exports = React.createClass({
  displayName: 'TopicForm',

  propTypes: {
    topic: React.PropTypes.instanceOf(Topic).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    minimal: React.PropTypes.bool
  },

  handleChange(e) {
    this.props.onChange(this.props.topic.set('preferred_name', e.target.value));
  },

  handleAlternateNameAdded(name) {
    this.props.onChange(
      this.props.topic
        .update('alternate_names', names => names.add(name)));
  },

  handleAlternateNameRemoved(name) {
    this.props.onChange(
      this.props.topic
        .update('alternate_names', names => names.delete(name)));
  },

  mergeValues(value) {
    this.props.onChange(this.props.topic.merge(value));
  },

  render() {
    var MultipleTextInput = require('../multiple_text_input/component.jsx')
      , RelatedTopicsSelector = require('../related_topic_selector/component.jsx')
      , HTMLEditor = require('../text_editor/component.jsx')
      , FieldErrors = require('../field_errors.jsx')
      , GeneralErrors = require('../general_errors.jsx')
      , { topic, projectURL, minimal, errors } = this.props

    return (
      <div>
        <GeneralErrors errors={errors.delete('preferred_name')} />

        <header>
          <h3>Preferred name</h3>

          <FieldErrors errors={errors.get('preferred_name')} />

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
            projectURL={projectURL}
            topics={topic.get('related_topics').toSet()} />
        </section>

        <section>
          <h3>Summary</h3>
          <HTMLEditor
              onChange={markup => this.mergeValues({ markup })}
              embeddedItems={Immutable.Set()}
              projectURL={projectURL}
              minimal={minimal}
              html={topic.markup} />
          <br />
        </section>
      </div>
    )
  }
});
