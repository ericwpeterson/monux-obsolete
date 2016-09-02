import React from 'react';
import { PropTypes } from 'react'
import {renderChart} from '../src/line-chart'
import { connect } from 'react-redux';
import { get, set, call, watch, unwatch } from '../src/ducks/monobject';
import Spinner from '../src/spinner'

let lineGraphContainerStyle = {margin: 'auto', width: 800, height: 200,
    borderStyle: 'solid', borderColor: '#e9e7e4', borderRadius: 5, borderWidth: 2
};

export class Line extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        renderChart(this.props.id, this.props.data);
    }

    render() {
        return (
            <div id={this.props.id} style={lineGraphContainerStyle} >
            </div>
        );
    }
}

export class LineGraph extends React.Component {
    constructor() {
        super();
    }

    static propTypes = {
       getLine: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.getLine(this.props.app.days.currentDay, this.props.app.currentDataPoint);
    }

    render() {
        let child;

        let showSpinner = false;

        try {
            if (this.props.monux.monobjects.stats.methods.getLineChartData.state === 'IN_PROGRESS') {
                showSpinner = true;
            }
        } catch (e) {}

        let spinner = <Spinner
            showSpinner={showSpinner}
            targetID="days"
            config={{
                top: '70%',
                scale: 4
            }}
        />

        try {
            if ( this.props.monux.monobjects.stats.methods.getLineChartData.value &&
                this.props.monux.monobjects.stats.methods.getLineChartData.state === 'COMPLETED' ) {
                    child =
                    <Line
                        id='line'
                        data={this.props.monux.monobjects.stats.methods.getLineChartData.value}
                        day={this.props.app.days.currentDay}
                    />
                }
        } catch (e) {}

        return (
            <div>
                {spinner}
                {child}
            </div>
        );
    }
}

function mapStateToProps(state) {
  return {
        app: state.app.toJS(),
        monux: state.monobjectReducer.toJS()
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getLine: (day, dataPoint) => {
            dispatch(call('stats', 'getLineChartData', [day, dataPoint] ));
        }
    }
}

const LineGraphContainer = connect(mapStateToProps,mapDispatchToProps)(LineGraph);
export default LineGraphContainer;
