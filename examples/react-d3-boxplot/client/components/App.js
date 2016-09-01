import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import { get, set, call, watch, unwatch } from '../src/ducks/monobject';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { mountChart, dataPointChange, yearChange } from  '../src/ducks/boxplots'
import Month from './Month.js';
import R, {map} from 'ramda';

let buttonDivStyle = {margin: 'auto', width: 300};

class App extends React.Component {
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

    yearSelector(year) {
        this.props.yearChange(year);
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
        let month;
        let yearButtons = [];

        if ( this.props.app && this.props.app.years ) {
            for ( let i =0; i < this.props.app.years.length; i++ ) {
                let val = this.props.app.years[i];
                yearButtons.push( <Button
                    active={this.props.app.currentYear === val}
                    onClick={this.yearSelector.bind(this,val) }> {val}
                </Button>)
            }
        }

        try {
            if ( this.props.app.months.chartData && !this.props.app.unMountChild ) {
                month = <Month />
            }
        } catch(e) {}

        return (
            <div>
                <div style={buttonDivStyle}>
                    <ButtonToolbar>
                        <ButtonGroup >
                            <Button active={this.props.app.currentDataPoint==='temperatureF'?true:false}
                                onClick={this.dataPointSelector.bind(this, 'temperatureF') }> Temp.
                            </Button>
                            <Button active={this.props.app.currentDataPoint==='relativeHumidity'?true:false}
                                onClick={this.dataPointSelector.bind(this, 'relativeHumidity') }> RH
                            </Button>
                            <Button active={this.props.app.currentDataPoint==='cO2Level'?true:false}
                                onClick={this.dataPointSelector.bind(this, 'cO2Level') }> C02
                            </Button>
                        </ButtonGroup >

                        <ButtonGroup >
                            {yearButtons}
                        </ButtonGroup >

                     </ButtonToolbar>
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
        },
        yearChange: (year) => {
            dispatch(yearChange(year))
        }
    }
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
export default AppContainer;
