"use strict";

var React = require('react')
  , Translate = require('../shared/translate.jsx')
  , strings = require('./strings')

function makeListItem(item) {
  return <li key={item.get('url')}><a href={item.get('url')}>{item.get('title')}</a></li>
}

module.exports = React.createClass({
  render: function () {
    return (
      <div>
        <section className="model-list">
          <h4><Translate text={strings.projects} /></h4>
          <ul className="unstyled">
          </ul>
        </section>

        <section className="model-list">
          <h4><Translate text={strings.recentNotes} /></h4>
          <ul className="unstyled">
          {this.props.data.get('notes').map(makeListItem)}
          </ul>
        </section>

        <div className="row">
          <section className="model-list span6">
            <h4><Translate text={strings.recentTopics} /></h4>
            <ul className="unstyled">
            {this.props.data.get('topics').map(makeListItem)}
            </ul>
          </section>

          <section className="model-list span6">
            <h4><Translate text={strings.recentDocuments} /></h4>
            <ul className="unstyled">
            {this.props.data.get('documents').map(makeListItem)}
            </ul>
          </section>

        </div>
      </div>
    )
  }
});
