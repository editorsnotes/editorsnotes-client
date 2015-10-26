var React = require('react')
  , TestComponent = require('./component.jsx')

window.EditorsNotes = {
  jed: require('../src/jed/')
}

window.onload = function () {
  React.render(
    React.createElement(TestComponent, null),
    document.getElementById('main')
  );
}
