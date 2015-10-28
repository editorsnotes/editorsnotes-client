"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , HydraAwareComponent = require('../../util/hydra_aware.jsx')
  , NoteDetail

NoteDetail = React.createClass({
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

  renderMarkup: function () {
    return <div dangerouslySetInnerHTML={{ __html: this.props.data.get('markup_html') }} />

  },

  render: function () {
    var NoteInformation = require('./information.jsx')
      , { data, canReplace } = this.props

    return (
      <div>
        { this.renderBreadcrumb() }

        <header>
          <h2>{ data.get('title') }</h2>
        </header>

        <section>
          <NoteInformation
              canReplace={canReplace}
              note={data} />
        </section>

        <section>
          { this.renderMarkup() }
        </section>
      </div>
    )
  }
});

module.exports = HydraAwareComponent(NoteDetail)
