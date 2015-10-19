"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../../shared/translate.jsx')
  , commonStrings = require('../../common_strings')

module.exports = React.createClass({
  displayName: 'NotesList',

  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map)
  },

  getInitialState() {
    return { notes: this.props.data.get('results') }
  },

  renderBreadcrumb: function () {
    var Breadcrumb = require('../../shared/breadcrumb/component.jsx')
      , { getEmbedded } = require('../../../helpers/api')
      , project = getEmbedded(this.props.data, 'project')
      , crumbs

    crumbs = Immutable.List([
      Immutable.Map({ href: project.get('url'), label: project.get('name') }),
      Immutable.Map({ label: <Translate text={commonStrings.note} number={1} /> })
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render() {
    var List = require('./list.jsx')
      , { notes } = this.state

    return (
      <div>
        { this.renderBreadcrumb() }
        <h1>Notes</h1>
        <List notes={notes} />
      </div>
    )
  }
});
