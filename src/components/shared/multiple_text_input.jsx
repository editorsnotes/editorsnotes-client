"use strict";

var React = require('react')
  , Immutable = require('immutable')

const RETURN_KEY = 13

module.exports = React.createClass({
  displayName: 'MultipleTextInput',

  propTypes: {
    values: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  removeValue: function(value) {
    this.props.onChange(
      this.props.values.delete(this.props.values.indexOf(value)))
  },

  handleKeyDown: function(e) {
    if (e.keyCode === RETURN_KEY &&
        e.target.value.length > 0 &&
        !this.props.values.includes(e.target.value)) {

      this.props.onChange(this.props.values.push(e.target.value))
      e.target.value = ''
    }
  },

  render: function () {
    return (
      <div className="multiple-text-input">
        <input
          type="text"
          style={{ width: '350px' }}
          placeholder="Enter a new alternate name and press return to add it."
          onKeyDown={this.handleKeyDown}
        />
        {
          this.props.values.map((value, i) =>
            <div key={'value-' + i} className="multiple-text-input-value">
              <span className="destroy"
                onClick={() => this.removeValue(value)}>
                <i className="fa fa-minus-circle" />
              </span>
              {value}
            </div>
          )
        }
      </div>
    )
  }
});
