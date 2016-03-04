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
      //Immutable.Map({ href: project.get('url'), label: project.get('name') }),
      Immutable.Map({ label: <Translate text={commonStrings.note} number={1} /> })
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render() {
    var { data } = this.props
      , projects = data.get('results')

    return (
      <div>
        { this.renderBreadcrumb() }
        <div className="clearfix">
          <a className="btn btn-primary right">Create new project</a>
        </div>
        <h1>Projects</h1>
        <h3>Featured item</h3>
        <div className="flex flex-center" style={{ height: 200 }}>
          <div className="bg-darken-1 flex-column mr2" style={{ width: "40%", height: "100%"}}></div>
          <div className="flex-column">
          </div>
        </div>
        <h3>Latest projects</h3>
        <div className="flex overflow-hidden">
        {
          projects.map(project =>
            <div className="col col-4 border-box border rounded mr2">
              <div className="bg-darken-2 flex flex-center" style={{ height: 100 }}>
                <h3>
                  { project.get('name') }
                </h3>
              </div>
              <div className="bg-darken-2 flex flex-center overflow-hidden" style={{ height: 30 }}>
                <span className="bg-black white rounded mr1 ml1"></span>
              </div>
            </div>
          )
        }
      </div>
    )
  }
});
