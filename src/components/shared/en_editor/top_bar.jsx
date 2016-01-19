"use strict";

var React = require('react')
  , Immutable = require('immutable')


const TOOLBAR_HEIGHT = '4em';


module.exports = React.createClass({
  displayName: 'TopBar',

  propTypes: {
  },

  getOptions(q) {
    var url = require('url')
      , apiFetch = require('../../../utils/api_fetch')
      , { itemType, projectURL } = this.props

    return apiFetch(url.format({
        pathname: projectURL + itemType + 's/',
        query: q.length === 0 ? undefined : { q }
      }))
      .then(resp => resp.json())
      .then(Immutable.fromJS)
      .then(data => {
        return { options: data.get('results').toArray() }
      });
  },

  renderOption(item) {
    var { getDisplayTitle } = require('../../../helpers/api')

    return getDisplayTitle(item);
  },

  render() {
    var Select = require('react-select')
      , { itemType, handleReferenceSelect } = this.props
      , style

    style = {
      height: TOOLBAR_HEIGHT,
      borderBottom: '1px solid #ccc'
    }

    return (
      <div className="border-box flex flex-center flex-justify-center" style={style}>
        {
          !itemType && (
            <div className="flex flex-justify flex-center col-12">
              <div className="px3 flex flex-center">
                <span className="h4 bold mr1">Reference a</span>
                <div className="inline-block clearfix">
                  <button className="left btn bg-white x-group-item btn-outline rounded-left">Topic</button>
                  <button className="left btn bg-white x-group-item btn-outline not-rounded">Note</button>
                  <button className="left btn bg-white x-group-item btn-outline rounded-right">Document</button>
                </div>
              </div>
              <div className="px3">
                <button
                    className="btn btn-primary mr1"
                    style={{
                      position: 'absolute',
                      height: '48px',
                      width: '120px',
                      top: '18px',
                      right: '48px',
                      fontSize: '18px'
                    }}>
                  Save
              </button>
              </div>
            </div>
          )
        }

        {
          itemType && (
            <div style={{ width: '400px' }}>
              <Select.Async
                  name="select"
                  value=""
                  ref="autocomplete"
                  minimumInput={2}
                  cache={null}
                  placeholder={`Search for a ${itemType}`}
                  filterOptions={opts => opts}
                  loadOptions={this.getOptions}
                  optionRenderer={this.renderOption}
                  valueRenderer={this.renderOption}
                  onChange={handleReferenceSelect} />
            </div>
          )
        }
      </div>
    )
  }
});
