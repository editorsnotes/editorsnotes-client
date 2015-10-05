"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'GeneralErrors',

  propTypes: {
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired
  },

  render() {
    var { errors } = this.props

    return errors.size > 0 && (
      <div className="alert alert-danger">
        {
          errors.map((fieldErrors, fieldName) =>
            <div key={fieldName}>
              { fieldName !== 'NON_FIELD_ERRORS' && <h4>{ fieldName }</h4> }
              <ul>
                { fieldErrors.map((err, i) => <li key={i}>{ err }</li>) }
              </ul>
            </div>
          )
        }
      </div>
    )
  }
});
