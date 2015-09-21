"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'FieldErrors',

  propTypes: {
    errors: React.PropTypes.instanceOf(Immutable.List)
  },

  getDefaultProps() {
    return { errors: Immutable.List() }
  },

  render() {
    var { errors } = this.props

    return errors.size > 0 && (
      <div className="alert alert-danger">
        <ul>
          { errors.map((err, i) => <li key={i}>{ err }</li>) }
        </ul>
      </div>
    )
  }
});
