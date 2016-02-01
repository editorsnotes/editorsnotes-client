"use strict";

var React = require('react')
  , Spinner = require('spin.js')

module.exports = React.createClass({
  displayName: 'Spinner',

  propTypes: {
    spin: React.PropTypes.bool.isRequired,
    opts: React.PropTypes.object
  },

  getInitialState() {
    return { spinner: null }
  },

  componentDidMount() {
    var { spin, opts } = this.props
      , spinner = new Spinner(opts)

    if (spin) spinner.spin(this.refs.wrapper);

    this.setState({ spinner });
  },

  componentWillReceiveProps(nextProps) {
    var { spin } = nextProps

    if (spin === this.props.spin) return;

    if (spin) {
      this.state.spinner.spin(this.refs.wrapper);
    } else {
      this.state.spinner.stop();
    }
  },

  render() {
    return (
      <div ref="wrapper" />
    )
  }
});
