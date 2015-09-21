"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../shared/translate.jsx')
  , standaloneForm = require('../shared/standalone_form.jsx')
  , commonStrings = require('../common_strings')
  , Topic = require('../../records/topic')
  , TopicEdit


TopicEdit = React.createClass({
  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map),
    loading: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    saveAndRedirect: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { topic: new Topic(this.props.data) }
  },

  handleTopicChange(topic) {
    this.setState({ topic });
  },

  handleSave() {
    var { saveAndRedirect } = this.props
      , { topic } = this.state

    saveAndRedirect(topic);
  },

  render() {
    var TopicForm = require('../shared/topic_form/component.jsx')
      , { loading, errors, projectURL } = this.props
      , { topic } = this.state

    return (
      <div>
        <TopicForm
            topic={topic}
            errors={errors}
            projectURL={projectURL}
            onChange={this.handleTopicChange} />

        <section>
          <div className="well">
            <button
                className="btn btn-primary btn-large"
                disabled={loading}
                onClick={this.handleSave}>
              <Translate text={commonStrings.save} />
            </button>
          </div>
        </section>

      </div>
    )
  }
});

module.exports = standaloneForm(TopicEdit, 'topic')
