import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import { get, set, call, watch, unwatch } from '../src/ducks/monobject';
import { Button } from 'react-bootstrap';
import { mountChart, dataPointChange } from  '../src/ducks/boxplots'
import Month from './Month.js';

let buttonDivStyle = {margin: 'auto', width: 200};

export default class App extends React.Component {
    constructor() {
        super();
    }

    static propTypes = {
       getStats: PropTypes.func.isRequired,
       dataPointChange: PropTypes.func.isRequired,
       unmountMonths: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.getStats();
    }

    dataPointSelector(dp) {
        this.props.dataPointChange(dp);
    }

    //this function is used to mount the d3 plot with the new data
    componentDidUpdate(prevProps, prevState) {
        try {
            if ( this.props.app.unMountChild ) {
                console.log('calling unMountMonths')
                this.props.unmountMonths(false);
            }
        } catch (e) {}
    }

    render() {

        console.log(' app this.props', this.props );

        let month;

        try {
            if ( this.props.app.months.chartData && !this.props.app.unMountChild ) {
                month = <Month />
            }
        } catch(e) {}

        return (
            <div>
                <div style={buttonDivStyle}>
                    <Button active={this.props.app.currentDataPoint==='temperatureF'?true:false}
                        onClick={this.dataPointSelector.bind(this, 'temperatureF') }> Temp.
                    </Button>
                    <Button active={this.props.app.currentDataPoint==='relativeHumidity'?true:false}
                        onClick={this.dataPointSelector.bind(this, 'relativeHumidity') }> RH
                    </Button>
                    <Button active={this.props.app.currentDataPoint==='cO2Level'?true:false}
                        onClick={this.dataPointSelector.bind(this, 'cO2Level') }> C02
                    </Button>
                </div>
                {month}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        app: state.app.toJS()
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
        unmountMonths: (val) => {
            dispatch(mountChart('app', val))
        }
    }
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
export default AppContainer;
