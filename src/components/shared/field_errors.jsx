"use strict";

var React = require('react')
  , Immutable = require('immutable')


function FieldErrors({ errors }) {
  errors = errors || Immutable.List()

  return errors.size > 0 && (
    <div className="px2 py1 bg-red rounded">
      <ul className="m0">
        { errors.map((err, i) => <li key={i}>{ err }</li>) }
      </ul>
    </div>
  )
}

FieldErrors.propTypes = {
  errors: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = FieldErrors;
