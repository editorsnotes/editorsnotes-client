"use strict";

var React = require('react')
  , Immutable = require('immutable')


function Breadcrumb({ crumbs }) {
  var truncatise = require('truncatise')
    , lastLabel = crumbs.last().get('label')

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
        crumbs.pop().map((crumb, i) =>
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

Breadcrumb.propTypes = {
  crumbs: React.PropTypes.instanceOf(Immutable.List).isRequired
}

module.exports = Breadcrumb;
