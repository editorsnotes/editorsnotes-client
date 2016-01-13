"use strict";

var _ = require('underscore')
  , React = require('react')
  , ReactDOM = require('react-dom')
  , classnames = require('classnames')


const TOOLBAR_HEIGHT = '4em';

function TopBar({ width, fixed }) {
  var className
    , style = { height: TOOLBAR_HEIGHT, lineHeight: TOOLBAR_HEIGHT }

  className = classnames(
    'bg-yellow',
    fixed ? 'fixed' : 'col-12'
  );

  if (fixed) {
    style.width = width;
    style.top = 0;
  }

  return (
    <div className={className} style={style}>
      I am the toolbar
    </div>
  )
}


function CodeMirror() {
  return (
    <div>
      I am codemirror
    </div>
  )
}


module.exports = React.createClass({
  displayName: 'TextEditor',

  propTypes: {
  },

  getInitialState() {
    return { fixed: false }
  },

  componentWillMount() {
    this.handleScroll = _.debounce(this.handleScroll, 5);
  },

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  handleScroll(e) {
    var el = ReactDOM.findDOMNode(this)
      , { top } = el.getBoundingClientRect()

    this.setState({ fixed: top < 0 });
  },

  render() {
    var { fixed } = this.state

    return (
      <div style={{ paddingTop: fixed ? TOOLBAR_HEIGHT : 0 }}>
        <TopBar {...this.props} {...this.state} />
        <div>
          <CodeMirror />
        </div>
      </div>
    )
  }
});
