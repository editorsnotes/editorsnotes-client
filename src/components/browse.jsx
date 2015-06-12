"use strict";

var React = require('react')

function makeListItem(item) {
  return <li key={item.get('url')}><a href={item.get('url')}>{item.get('title')}</a></li>
}

module.exports = React.createClass({
  render: function () {
    return (
      <div>
        <section className="model-list">
          <h4>Projects</h4>
          <ul className="unstyled">
          </ul>
        </section>

        <section className="model-list">
          <h4>Recently edited notes</h4>
          <ul className="unstyled">
          {this.props.data.get('notes').map(makeListItem)}
          </ul>
        </section>

        <div className="row">
          <section className="model-list span6">
            <h4>Recently edited topics</h4>
            <ul className="unstyled">
            {this.props.data.get('topics').map(makeListItem)}
            </ul>
          </section>

          <section className="model-list span6">
            <h4>Recently edited documents</h4>
            <ul className="unstyled">
            {this.props.data.get('documents').map(makeListItem)}
            </ul>
          </section>

        </div>
      </div>
    )
  }
});
