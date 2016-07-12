
"use strict";

const React = require('react')
    , Immutable = require('immutable')
    , Translate = require('./translate.jsx')
    , Breadcrumb = require('./breadcrumb/component.jsx')
    , commonStrings = require('../common_strings')
    , { getEmbedded } = require('../../helpers/api')

function getItemLabel(type, data) {
  if (type === 'note') {
    return data.get('title');
  } else if (type === 'topic') {
    return data.get('preferred_name');
  } else if (type === 'document') {
    return data.get('description')
  } else {
    throw TypeError();
  }
}

const EditingBreadcrumb = ({ type, data, project }) => {
  project = project || getEmbedded(data, 'project')

  let crumbs = Immutable.List([
    Immutable.Map({ href: project.get('url'), label: project.get('name') }),
    Immutable.Map({
      href: project.get('url') + `${type}s/`,
      label: <Translate text={commonStrings[type]} number={1} />
    })
  ])

  crumbs = crumbs.concat(Immutable.List(
    !data
      ? [ Immutable.Map({ label: <Translate text={commonStrings.add} /> }) ]
      : [ Immutable.Map({ href: data.get('url'), label: getItemLabel(type, data) }),
          Immutable.Map({ label: <Translate text={commonStrings.edit} /> }) ]
  ))

  return <Breadcrumb crumbs={crumbs} />
}

EditingBreadcrumb.propTypes = {
  type: React.PropTypes.oneOf(['note', 'topic', 'document']),
  data: React.PropTypes.instanceOf(Immutable.Map),
  project: React.PropTypes.instanceOf(Immutable.Map),
}

module.exports = EditingBreadcrumb;
