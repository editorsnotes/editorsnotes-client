"use strict";

var React = require('react')
  , TestComponent = require('./component.jsx')

window.EditorsNotes = {
  jed: require('../src/jed/')
}

window.onload = function () {
  var { render } = require('react-dom')

  render(
    React.createElement(TestComponent, null),
    document.getElementById('main')
  );
}
