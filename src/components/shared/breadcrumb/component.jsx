"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , truncatise = require('truncatise')
  , Breadcrumb

Breadcrumb = ({ crumbs }) => (
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

    {
      typeof crumbs.last().get('label') === 'string' ?
        <li className="inline-block gray" dangerouslySetInnerHTML={{
          __html: truncatise(crumbs.last().get('label'), {
            TruncateBy: 'characters',
            StripHTML: true,
            Strict: false
          }).replace(/&#?\d*\.{3}$/, '...')
        }} /> :
        <li className="inline-block gray">{ crumbs.last().get('label') }</li>
    }
  </ul>
)

Breadcrumb.propTypes = {
  crumbs: React.PropTypes.instanceOf(Immutable.List).isRequired
}

module.exports = Breadcrumb;
