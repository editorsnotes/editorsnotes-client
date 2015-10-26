"use strict";

var React = require('react')
  , Immutable = require('immutable')

const RETURN_KEY = 13

module.exports = React.createClass({
  displayName: 'MultipleTextInput',

  propTypes: {
    values: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onValueAdded: React.PropTypes.func,
    onValueRemoved: React.PropTypes.func
  },

  handleKeyDown: function(e) {
    if (e.keyCode === RETURN_KEY &&
        e.target.value.length > 0 &&
        !this.props.values.includes(e.target.value)) {

      this.props.onValueAdded(e.target.value)
      e.target.value = ''
    }
  },

  render: function () {
    return (
      <div className="multiple-text-input">
        <input
          type="text"
          className="field"
          style={{ width: '350px' }}
          placeholder="Enter a new alternate name and press return to add it."
          onKeyDown={this.handleKeyDown}
        />
        {
          this.props.values.map((value, i) =>
            <div key={'value-' + i} className="multiple-text-input-value">
              <a href="#" className="destroy mr1"
                onClick={this.props.onValueRemoved.bind(null, value)}>
                <i className="fa fa-minus-circle" />
              </a>
              {value}
            </div>
          )
        }
      </div>
    )
  }
});
