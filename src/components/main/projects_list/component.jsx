"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../../shared/translate.jsx')
  , commonStrings = require('../../common_strings')

module.exports = React.createClass({
  displayName: 'ProjectsList',

  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map)
  },

  renderBreadcrumb: function () {
    var Breadcrumb = require('../../shared/breadcrumb/component.jsx')
      , crumbs

    crumbs = Immutable.List([
      Immutable.Map({ label: <Translate text={commonStrings.project} number={2} /> })
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render() {
    var { data, user } = this.props
      , projects = data.get('results')

    return (
      <div>
        { this.renderBreadcrumb() }

        { user && (
          <div className="right mt2">
            <a href="/auth/account/projects/" className="btn btn-primary">
              Create new project
            </a>
          </div>
        )}

        <h1>Projects</h1>

        <h2>Latest projects</h2>
        <div className="flex overflow-hidden">
        {
          projects.map(project =>
            <div key={project.get('url')} className="col col-4 border-box border rounded mr2">
              <div className="bg-darken-2 flex flex-center flex-justify-center" style={{ height: 100 }}>
                <h3 className="m0">
                  <a href={project.get('url')}>
                    { project.get('name') }
                  </a>
                </h3>
              </div>
            </div>
          )
        }
        </div>
      </div>
    )
  }
});
