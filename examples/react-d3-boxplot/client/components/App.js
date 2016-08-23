import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import { get, set, call, watch, unwatch } from '../src/monobject-actions.js';
import { Button } from 'react-bootstrap';

import R, {map} from 'ramda';
import { unmountMonth, dataPointChange } from  '../src/app-actions.js'

import Month from './Month.js';


let divStyle = {}
let lineGraphContainerStyle = {
    margin: 'auto', width: 800, height: 200, borderStyle: 'solid',
    borderColor: '#e9e7e4', borderRadius: 5, borderWidth: 2
};


let buttonDivStyle = {margin: 'auto', width: 200};

let getItems = R.curry((dataPoint, item) => item[dataPoint])
let pickFields = R.curry((obj, key)  => [ key,
                                            [ obj[key].min, obj[key].q1, obj[key].median,
                                                obj[key].q3, obj[key].max,
                                                ...obj[key].outliers
                                            ]
                                        ])
let iterateObjectKeys = (obj) => R.map(pickFields(obj), R.keys(obj))
let filterFn = obj =>  obj.max && obj.min && obj.median && obj.q1 && obj.q3 && obj.outliers
let getChartData = (dataPoint) => R.compose( iterateObjectKeys, R.filter(filterFn), R.map( getItems(dataPoint)));



export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            unMountChild: false
        }
    }

    static propTypes = {
       getStats: PropTypes.func.isRequired,
       dataPointChange: PropTypes.func.isRequired,
       unmountMonth: PropTypes.func.isRequired,
       monthChange: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.getStats();
    }

    dataPointSelector(dp) {
        this.props.dataPointChange(dp);
    }

    componentDidUpdate(prevProps, prevState) {
      console.log('componentDidUpdate prev', prevProps.appState);
      console.log('componentDidUpdate current', this.props.appState);

      try {
        if ( this.props.appState.unmountMonth === true  ) {
          this.props.unmountMonth(false);
        }
      } catch(e) {}
    }

    render() {
        let month;

        console.log( 'app this.props', this.props.stats);
        console.log( 'app this.props.appState', this.props.appState);

        try {
            if ( this.props.stats.props.stats.value ) {
               if ( !(this.props.appState.unmountMonth) ) {
                month = <Month stats={this.props.stats.props.stats.value}
                        dataPoint={this.props.appState.currentDataPoint}                        
                       />
               }
            }
        } catch(e) {}

        return (
            <div>
                <div style={buttonDivStyle}>
                    <Button active={this.state.currentDataPoint==='temperatureF'?true:false}
                        onClick={this.dataPointSelector.bind(this, 'temperatureF') }> Temp.
                    </Button>
                    <Button active={this.state.currentDataPoint==='relativeHumidity'?true:false}
                        onClick={this.dataPointSelector.bind(this, 'relativeHumidity') }> RH
                    </Button>
                    <Button active={this.state.currentDataPoint==='cO2Level'?true:false}
                        onClick={this.dataPointSelector.bind(this, 'cO2Level') }> C02
                    </Button>
                </div>
                {month}
            </div>
        )
    }
}

function mapStateToProps(state) {
  console.log( 'state = ', state)

  console.log( state.monobjects.toJS())

  let stats
  try {
    stats = state.monobjects.toJS().monobjects.stats
  } catch (e) {}

  return {
        stats: stats,
        appState: state.appReducer.toJS()
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getStats: () => {
            dispatch(get('stats', 'stats'));
        },
        dataPointChange: (dataPoint) => {
          console.log('data point change', dataPoint)
            dispatch(dataPointChange(dataPoint));
        },
        unmountMonth: (val) => {
            dispatch(unmountMonth(val))
        }


    }
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
export default AppContainer;
