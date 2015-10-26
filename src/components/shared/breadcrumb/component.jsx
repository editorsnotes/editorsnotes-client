"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'Breadcrumb',

  propTypes: {
    crumbs: React.PropTypes.instanceOf(Immutable.List).isRequired
  },

  render: function () {
    var truncatise = require('truncatise')
      , lastLabel = this.props.crumbs.last().get('label')

    if (typeof lastLabel === 'string') {
      lastLabel = truncatise(lastLabel, {
        TruncateBy: 'characters',
        StripHTML: true,
        Strict: false
      });

      lastLabel = lastLabel.replace(/&#?\d*\.{3}$/, '...');
    }

    return (
      <ul className="list-reset">
        {
          this.props.crumbs.pop().map((crumb, i) =>
            <li className="inline-block" key={i}>
              <a href={crumb.get('href')}>
                {crumb.get('label')}
              </a>
              <span className="inline-block px1 gray muted"> > </span>
            </li>
          )
        }

        {
          typeof lastLabel === 'string' ?
            <li className="inline-block gray" dangerouslySetInnerHTML={{ __html: lastLabel }} /> :
            <li className="inline-block gray">{ lastLabel }</li>
        }
      </ul>
    )
  }
});
