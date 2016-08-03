"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , HydraAwareComponent = require('../../util/hydra_aware.jsx')
  , { connect } = require('react-redux')

const NoteDetail = React.createClass({
  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    canReplace: React.PropTypes.func.isRequired
  },

  renderBreadcrumb: function () {
    var Breadcrumb = require('../../shared/breadcrumb/component.jsx')
      , note = this.props.data
      , project = note.get('embedded').get(note.get('project'))
      , crumbs

    crumbs = Immutable.fromJS([
      { href: project.get('url'), label: project.get('name') },
      { href: project.get('url') + 'notes/', label: 'Notes' },
      { label: note.get('title') }
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render: function () {
    var NoteInformation = require('./information.jsx')
      , { data, canReplace } = this.props

    return (
      <div>
        { this.renderBreadcrumb() }

        <section>
          <NoteInformation
              canReplace={canReplace}
              note={data} />
        </section>

        <hr />

        <section>
          <div
              className="ItemText"
              dangerouslySetInnerHTML={{
                __html: this.props.data.get('markup_html')
              }} />
        </section>
      </div>
    )
  }
});

module.exports = connect(require('../default_api_mapper'))(HydraAwareComponent(NoteDetail))
