import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import { get, set, call, watch, unwatch } from '../src/ducks/monobject';
import { Button } from 'react-bootstrap';
import { unmountMonth, dataPointChange } from  '../src/ducks/app'
import Month from './Month.js';

let buttonDivStyle = {margin: 'auto', width: 200};

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
       unmountMonth: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.getStats();
    }

    dataPointSelector(dp) {
        this.props.dataPointChange(dp);
    }

    componentDidUpdate(prevProps, prevState) {
      try {
        if ( this.props.appState.unmountMonth === true  ) {
          this.props.unmountMonth(false);
        }
      } catch(e) {}
    }

    render() {

        let month;
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
            dispatch(dataPointChange(dataPoint));
        },
        unmountMonth: (val) => {
            dispatch(unmountMonth(val))
        }
    }
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
export default AppContainer;
