"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , classnames = require('classnames')
  , FieldErrors


FieldErrors = ({ errors=Immutable.List() }) => (
  <div className={classnames("px2 py1 bg-red rounded", !errors.size && 'display-none')} >
    <ul className="m0">
      { errors.map((err, i) => <li key={i}>{ err }</li>) }
    </ul>
  </div>
)

FieldErrors.propTypes = {
  errors: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = FieldErrors;
