"use strict";

const React = require('react')
    , Immutable = require('immutable')
    , { connect } = require('react-redux')

const Project = React.createClass({
  propTypes: {
    project: React.PropTypes.instanceOf(Immutable.Map)
  },

  renderBreadcrumb() {
    const Breadcrumb = require('../../shared/breadcrumb/component.jsx')
        , { project } = this.props

    const crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') }
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render() {
    const { project } = this.props

    return (
    <div id="project">

      {this.renderBreadcrumb()}

      <header>
        <h2>{project.get('name')}</h2>
      </header>
      <section>
        <div>
          <p>{ project.get('description') }</p>
        </div>
        <ul>
          <li><a href={project.get('notes')}>All notes</a></li>
          <li><a href={project.get('topics')}>All topics</a></li>
          <li><a href={project.get('documents')}>All documents</a></li>
        </ul>
      </section>
    </div>
    )
  }
});

module.exports = connect(require('../default_api_mapper')('project'))(Project)
