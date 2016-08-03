"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../../shared/translate.jsx')
  , standaloneForm = require('../../util/standalone_form.jsx')
  , commonStrings = require('../../common_strings')
  , Topic = require('../../../records/topic')
  , { connect } = require('react-redux')


const TopicEdit = React.createClass({
  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map),
    topic: React.PropTypes.instanceOf(Topic).isRequired,
    loading: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    projectURL: React.PropTypes.string.isRequired,
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
            { saveButton }
          </div>
        </section>

      </div>
    )
  }
});

module.exports = connect(require('../default_api_mapper'))(standaloneForm(TopicEdit, Topic));
