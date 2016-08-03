"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , EmbeddedItemsHandler = require('../../util/embedded_items_handler.jsx')
  , Topic = require('../../../records/topic')
  , TopicForm

TopicForm = React.createClass({
  displayName: 'TopicForm',

  propTypes: {
    topic: React.PropTypes.instanceOf(Topic).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map),
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

  handleTopicsChange(topics) {
    var { onAddEmbeddedItem } = this.props

    this.mergeValues({
      'related_topics': topics.map(topic => topic.get('url'))
    });

    topics.forEach(topic => onAddEmbeddedItem(topic));
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
      , { getEmbedded } = require('../../../helpers/api')
      , { topic, projectURL, minimal, errors, embeddedItems } = this.props

    return (
      <div>
        { errors && <GeneralErrors errors={errors.delete('preferred_name')} /> }

        <header>
          <h3>Preferred name</h3>

          { errors && <FieldErrors errors={errors.get('preferred_name')} /> }

          <input
              type="text"
              className="field"
              name="preferred-name"
              maxLength="80"
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
            topics={getEmbedded(Immutable.Map({
              topics: topic.related_topics,
              embedded: embeddedItems.toMap().mapKeys((key, val) => val.get('url'))
            }), 'topics').toSet()}
            onChange={this.handleTopicsChange} />
        </section>

        <section>
          <h3>Summary</h3>
          <div className="absolute" style={{ height: 300, left: 0, right: 0 }}>
            <HTMLEditor
                onChange={markup => this.mergeValues({ markup })}
                embeddedItems={Immutable.Set()}
                projectURL={projectURL}
                minimal={minimal}
                html={topic.markup} />
          </div>
          <div style={{ height: 320 }} />
        </section>
      </div>
    )
  }
});

module.exports = EmbeddedItemsHandler(TopicForm);
