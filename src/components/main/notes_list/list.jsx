"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'NoteItemList',

  propTypes: {
    notes: React.PropTypes.instanceOf(Immutable.List)
  },

  render() {
    var { notes } = this.props

    return (
      <div>
        {
          notes.map(note =>
            <div key={note.get('id')}>
              <h3>
                <a href={note.get('url')}>
                  { note.get('title') }
                </a>
              </h3>
            </div>
          )
        }
      </div>
    )
  }
});
