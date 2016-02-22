"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../../shared/translate.jsx')
  , commonStrings = require('../../common_strings')

module.exports = React.createClass({
  displayName: 'ProejctsList',

  propTypes: {
    data: React.PropTypes.instanceOf(Immutable.Map)
  },

  getInitialState() {
    console.log(this.props.data.get('results'));
    return { projects: this.props.data.get('results') }
  },

  renderBreadcrumb: function () {
    var Breadcrumb = require('../../shared/breadcrumb/component.jsx')
      , { getEmbedded } = require('../../../helpers/api')
      //, project = getEmbedded(this.props.data, 'project')
      , crumbs

    crumbs = Immutable.List([
      //Immutable.Map({ href: project.get('url'), label: project.get('name') }),
      Immutable.Map({ label: <Translate text={commonStrings.note} number={1} /> })
    ]);

    return <Breadcrumb crumbs={crumbs} />
  },

  render() {
    var List = require('./list.jsx')
      , NotesList = require('./note_list.jsx')
      , { projects } = this.state

    return (
      <div>
        { this.renderBreadcrumb() }
        <div className="clearfix">
          <a className="btn btn-primary right">Create new project</a>
        </div>
        <h1>Projects</h1>
        <h3>Featured item</h3>
        <div className="Featured flex flex-center" style={{ height: 200 }}>
          <div className="Picture bg-darken-1 flex-column mr2" style={{ width: "40%", height: "100%"}}></div>
          <div className="flex-column">
            <div>
              <h3>The Margaret Sanger Papers</h3>
              <p>The Margaret Sanger Papers is a historical editing project 
              located in the Department of History at New York University.</p>
            </div>
          </div>
        </div>
        <h3>Latest projects</h3>
        <div className="Latest flex overflow-hidden">
        {
          projects.map(project =>
            <div className="Project col col-4 border-box border rounded mr2">
              <div className="ProjectName bg-darken-2 flex flex-center" style={{ height: 100 }}>
                <h3 className="ProjectName">
                  { project.get('name') }
                </h3>
              </div>
              <div className="Topics bg-darken-2 flex flex-center overflow-hidden" style={{ height: 30 }}>
                <span className="bg-black white rounded mr1 ml1">Margaret</span>
                <span className="bg-black white rounded mr1 ml1">Smith_College</span>
                <span className="bg-black white rounded mr1 ml1">1900-1928</span>
              </div>
              <div className="ProjectSummary flex flex-center" style={{ height: 30 }}></div>
              <div className="px1" style={{ marginLeft: "auto" }}>N:3 D:10 T:20 P:2</div>
            </div>
          )
        }
        </div>
        //<List projects={projects} />
        <h3>Trending projects</h3>
        <div className="Trending flex">
        {
          projects.map(project => 
            <div className="Project col-3 border-box mr1" style={{ height: 150 }}>
              <div className="Name">
                <h4>{ project.get("name") }</h4>
              </div>
              <div className="Counts">
                N:3 D:10 T:20 P:2
              </div>
              <div className="Description">
                The Emma Goldman Papers is part of a national initiative to retrieve the papers of individuals whose life work has had a lasting impact on the course of American history.
              </div>
            </div>
          )
        }
        </div>
      </div>
    )
  }
});
