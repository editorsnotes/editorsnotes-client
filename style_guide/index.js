var React = require('react')
  , TestComponent = require('./component.jsx')

window.onload = function () {
  React.render(
    React.createElement(TestComponent, null),
    document.getElementById('main')
  );
}
