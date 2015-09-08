"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Topic = require('../../records/topic')


module.exports = React.createClass({
  displayName: 'TopicEdit',

  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map),
    project: React.PropTypes.instanceOf(Immutable.Map),
  },

  getInitialState() {
    return { topic: new Topic(this.props.data) }
  },

  renderBreadcrumb() {
    var Breadcrumb = require('../shared/breadcrumb/component.jsx')
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

  isNew() {
    return !this.props.data
  },

  getProjectURL() {
    return this.isNew() ?
      this.props.project.get('url') :
      this.props.data.get('url').replace(/\/topics\/.*/, '/')
  },

  handleTopicChange(topic) {
    this.setState({ topic });
  },

  handleSave() {
    var saveItem = require('../../utils/save_item')
      , id = this.isNew() ? null : this.props.data.get('id')

    saveItem('note', id, this.getProjectURL(), this.state.note)
  },


  render() {
    var TopicForm = require('../shared/topic_form/component.jsx')

    return (
      <div>
        { this.renderBreadcrumb() }

        <TopicForm
            topic={this.state.topic}
            projectURL={this.getProjectURL()}
            onChange={this.handleTopicChange} />

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
