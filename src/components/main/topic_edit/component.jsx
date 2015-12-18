"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../../shared/translate.jsx')
  , standaloneForm = require('../../util/standalone_form.jsx')
  , commonStrings = require('../../common_strings')
  , Topic = require('../../../records/topic')
  , TopicEdit


TopicEdit = React.createClass({
  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map),
    topic: React.PropTypes.instanceOf(Topic).isRequired,
    loading: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    saveAndRedirect: React.PropTypes.func.isRequired,
    handleRecordChange: React.PropTypes.func.isRequired
  },

  render() {
    var TopicForm = require('../../shared/topic_form/component.jsx')
      , { loading, errors, projectURL, topic, handleRecordChange, saveAndRedirect } = this.props

    return (
      <div>
        <TopicForm
            topic={topic}
            errors={errors}
            projectURL={projectURL}
            onChange={handleRecordChange} />

        <section>
          <div className="well">
            <button
                className="btn btn-primary btn-large"
                disabled={loading}
                onClick={saveAndRedirect}>
              <Translate text={commonStrings.save} />
            </button>
          </div>
        </section>

      </div>
    )
  }
});

module.exports = standaloneForm(TopicEdit, 'topic')
