"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'NoteItemList',

  propTypes: {
    projects: React.PropTypes.instanceOf(Immutable.List)
  },

  render() {
    var { projects } = this.props
    //console.log(notes["_tail"].array[0]); 

    return (
      <div>
        {
          projects.map(project =>
            <div key={project.get('id')}>
              <h3>
                <a href={project.get('url')}>
                  { project.get('title') }
                </a>
              </h3>
            </div>
          )
        }
      </div>
    )
  }
});
