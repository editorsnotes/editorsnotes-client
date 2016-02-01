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

  getInitialState() {
    var { getEmbedded } = require('../../../helpers/api')
      , { data } = this.props
      , embeddedItems

    embeddedItems = data ?
      getEmbedded(data, 'references').toOrderedSet() :
      Immutable.OrderedSet()

    return { embeddedItems }
  },

  handleAddEmbeddedItem(item) {
    this.setState(prev => ({
      embeddedItems: prev.embeddedItems.add(item)
    }));
  },

  render() {
    var TopicForm = require('../../shared/topic_form/component.jsx')
      , { loading, handleRecordChange, saveAndRedirect } = this.props

    return (
      <div>
        <TopicForm
            {...this.props}
            {...this.state}
            onChange={handleRecordChange}
            onAddEmbeddedItem={this.handleAddEmbeddedItem} />

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

module.exports = standaloneForm(TopicEdit, Topic);
