"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , classnames = require('classnames')
  , GeneralErrors


GeneralErrors = ({ errors }) => (
  <div className={classnames("alert alert-danger", { 'display-none': errors.size === 0 })}>
    {
      errors.map((fieldErrors, fieldName) =>
        <div key={fieldName}>
          { fieldName !== 'NON_FIELD_ERRORS' && <h4>{ fieldName }</h4> }
          <ul>
            { fieldErrors.map((err, i) => <li key={i}>{ err }</li>) }
          </ul>
        </div>
      ).toArray()
    }
  </div>
)

GeneralErrors.propTypes = {
  errors: React.PropTypes.instanceOf(Immutable.Map).isRequired
}

module.exports = GeneralErrors;
