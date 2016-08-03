"use strict";

const React = require('react')
  , Immutable = require('immutable')
  , truncatise = require('truncatise')

function truncate(label) {
  return truncatise(label, {
    TruncateBy: 'characters',
    TruncateLength: 42,
    StripHTML: true,
    Strict: true
  })
}

const Breadcrumb = ({ crumbs }) => (
  <ul className="list-reset">
    {
      crumbs.pop().map((crumb, i) =>
        <li className="inline-block" key={i}>
          <a href={crumb.get('href')}>
            { crumb.get('label') }
          </a>
          <span className="inline-block px1 gray muted"> > </span>
        </li>
      )
    }


    <li className="inline-block gray">
      {
        typeof crumbs.last().get('label') === 'string'
          ? truncate(crumbs.last().get('label'))
          : crumbs.last().get('label')
      }
    </li>
  </ul>
)

Breadcrumb.propTypes = {
  crumbs: React.PropTypes.instanceOf(Immutable.List).isRequired
}

module.exports = Breadcrumb;
