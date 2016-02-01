"use strict";

var React = require('react')
  , Immutable = require('immutable')


const TOOLBAR_HEIGHT = '4em';


module.exports = React.createClass({
  displayName: 'TopBar',

  propTypes: {
  },

  getInitialState() {
    return { insertingReferenceType: null }
  },

  handleSelect(item) {
    var { selectingReferenceType, handleReferenceSelect, handleClickAddItem } = this.props

    this.setState({ insertingReferenceType: null });

    if (item.blank) {
      handleClickAddItem(item.itemType, item.initialText);
    } else if (selectingReferenceType) {
      handleReferenceSelect(selectingReferenceType);
    } else {
      this.handleReferenceAdd(item);
    }
  },

  getOptions(q) {
    var url = require('url')
      , apiFetch = require('../../../utils/api_fetch')
      , { selectingReferenceType, projectURL } = this.props
      , { insertingReferenceType } = this.state
      , itemType = selectingReferenceType || insertingReferenceType

    if (itemType === 'citation-block') {
      itemType = 'document';
    }

    return apiFetch(url.format({
        pathname: projectURL + itemType + 's/',
        query: q.length === 0 ? undefined : { q }
      }))
      .then(resp => resp.json())
      .then(Immutable.fromJS)
      .then(data => {
        return {
          options: data
            .get('results')
            .push({
              itemType,
              initialText: q,
              blank: true,
              label: (
                <div className="center py2">
                  <button className="btn btn-primary">{ `Add new ${itemType}` }</button>
                </div>
              )
            })
            .toArray()
        }
      });
  },

  renderOption(item) {
    var { getDisplayTitle } = require('../../../helpers/api')

    return item.label || getDisplayTitle(item);
  },

  handleReferenceAdd(item) {
    var { handleReferenceAdd } = this.props
      , { insertingReferenceType } = this.state

    this.setState({ insertingReferenceType: null });

    handleReferenceAdd(insertingReferenceType, item);
  },

  handleAddReferenceButtonClick(insertingReferenceType) {
    this.setState({ insertingReferenceType });

    setTimeout(() => this.refs.autocomplete.focus(), 10);
  },

  render() {
    var Select = require('react-select')
      , Spinner = require('../spinner/component.jsx')
      , { selectingReferenceType, newItemType, loading, handleSave } = this.props
      , { insertingReferenceType } = this.state
      , itemType = selectingReferenceType || insertingReferenceType
      , style

    if (itemType === 'citation-block') {
      itemType = 'document';
    }

    style = {
      height: TOOLBAR_HEIGHT,
      borderBottom: '1px solid #ccc'
    }

    return (
      <div className="border-box flex flex-center flex-justify-center" style={style}>
        {
          !itemType && !newItemType && (
            <div className="flex flex-justify flex-center col-12">
              <div className="px3 flex flex-center">
                <span className="h4 bold mr1">Reference a</span>
                <div className="inline-block clearfix mr3">
                  <button
                      className="left btn bg-white x-group-item btn-outline rounded-left"
                      onClick={this.handleAddReferenceButtonClick.bind(null, 'topic')}>
                    Topic
                  </button>

                  <button
                      className="left btn bg-white x-group-item btn-outline not-rounded"
                      onClick={this.handleAddReferenceButtonClick.bind(null, 'note')}>
                    Note
                  </button>

                  <button
                      className="left btn bg-white x-group-item btn-outline rounded-right"
                      onClick={this.handleAddReferenceButtonClick.bind(null, 'document')}>
                    Document
                  </button>
                </div>

                <button
                    className="btn bg-white btn-outline"
                    onClick={this.handleAddReferenceButtonClick.bind(null, 'citation-block')}>
                  Add a citation block
                </button>

              </div>
              <div className="px3">
                <button
                    onClick={handleSave}
                    disabled={loading}
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
                  <Spinner
                      opts={require('../spinner/opts').compact}
                      spin={loading} />
              </button>
              </div>
            </div>
          )
        }

        {
          itemType && !newItemType && (
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
                  onBlur={() => this.setState({ insertingReferenceType: null })}
                  onChange={this.handleSelect} />
            </div>
          )
        }

        {
          newItemType && (
            <div>Adding { newItemType }...</div>
          )
        }

      </div>
    )
  }
});
