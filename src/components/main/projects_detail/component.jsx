"use strict";

var React = require('react')
  , Immutable = require('immutable')


module.exports = React.createClass({
  displayName: 'Project',

  renderBreadcrumb: function () {
    var Breadcrumb = require('../../shared/breadcrumb/component.jsx')
      , project = this.props.data
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') }
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render: function () {
    var project = this.props.data

    console.log(project.toJS())

    return (
    <div id="project">

      {this.renderBreadcrumb()}

      <header><h2>{project.get('name')}</h2></header>
      <section id="project-details">
        <div id="project-about">
          <p>{project.get('description')}</p>
        </div>
        <ul>
          <li><a href={project.get('notes_url')}>All notes</a></li>
          <li><a href={project.get('topics_url')}>All topics</a></li>
          <li><a href={project.get('documents_url')}>All documents</a></li>
        </ul>
      </section>
    </div>
    )
  }
});
