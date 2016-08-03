"use strict";

const React = require('react')
    , Immutable = require('immutable')
    , { connect } = require('react-redux')

const Project = React.createClass({
  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map)
  },

  renderBreadcrumb() {
    const Breadcrumb = require('../../shared/breadcrumb/component.jsx')
        , { data } = this.props

    const crumbs = Immutable.fromJS([
      { href: data.get('url'), label: data.get('name') }
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render() {
    const { data } = this.props

    return (
    <div id="project">

      {this.renderBreadcrumb()}

      <header>
        <h2>{data.get('name')}</h2>
      </header>
      <section>
        <div>
          <p>{ data.get('description') }</p>
        </div>
        <ul>
          <li><a href={data.get('notes')}>All notes</a></li>
          <li><a href={data.get('topics')}>All topics</a></li>
          <li><a href={data.get('documents')}>All documents</a></li>
        </ul>
      </section>
    </div>
    )
  }
});

module.exports = connect(require('../default_api_mapper'))(Project)
