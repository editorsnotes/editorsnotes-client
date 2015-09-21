"use strict";

var React = require('react')
  , Spinner = require('spin.js')

module.exports = React.createClass({
  displayName: 'Spinner',
  
  propTypes: {
    spin: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return { spinner: null }
  },

  componentDidMount() {
    var { spin } = this.props
      , spinner = new Spinner()

    if (spin) spinner.spin(React.findDOMNode(this))

    this.setState({ spinner });
  },

  componentWillReceiveProps(nextProps) {
    var { spin } = nextProps

    if (spin === this.props.spin) return;

    if (spin) {
      this.state.spinner.spin(React.findDOMNode(this));
    } else {
      this.state.spinner.stop();
    }
  },

  render() {
    return (
      <div />
    )
  }
});
