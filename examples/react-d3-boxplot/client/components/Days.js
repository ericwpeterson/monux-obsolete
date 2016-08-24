import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import {BoxPlot} from './BoxPlot';
import { dayChange, unmountDay } from  '../src/ducks/day.js'
import {renderChart} from '../src/line-chart'

let lineGraphContainerStyle = {margin: 'auto', width: 800, height: 200,
    borderStyle: 'solid', borderColor: '#e9e7e4', borderRadius: 5, borderWidth: 2
};

export class LineGraph extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {

        let tokens = this.props.day.split('-');
        let y = tokens[0];
        let m = tokens[1];
        let d = tokens[2];

        let dayBegin = new Date(y,+m - 1,d);
        let dayEnd = new Date( dayBegin.getTime() + 86400000);

        let data = [
            {
                date: dayBegin,
                val: 22
            },
            {
                date: dayEnd,
                val: 45
            }
        ];
        renderChart(this.props.id, data);
    }

    render() {
        return (
            <div>
                <div id={this.props.id} style={lineGraphContainerStyle} > </div>
            </div>
        );
    }
}

export class Days extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    static propTypes = {
       unmountDay: PropTypes.func.isRequired,
       dayChange: PropTypes.func.isRequired
    };

    //this function is used to mount the d3 plot with the new data
    componentDidUpdate(prevProps, prevState) {
        try {
            if ( this.props.dayState.unmountDay === true  ) {
                this.props.unmountDay(false);
            }
        } catch(e) {}
    }

    clickHandler(d) {
        this.props.dayChange(d[0]);
    }

    render() {
        let child;

        if ( this.props.dayState.currentDay &&  !this.props.dayState.unmountDay ) {
            child =
                <LineGraph id='lineGraph' day={this.props.dayState.currentDay}
                    dataPoint={this.props.dataPoint}
            />
        }

        return (
            <div>
                <BoxPlot id='days' title='Days' data={this.props.data} min={this.props.min} max={this.props.max}
                    clickHandler={this.clickHandler}
                />
                {child}
            </div>
        )
    }
};

function mapStateToProps(state) {
  return {
        dayState: state.dayReducer.toJS()
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        unmountDay: (val) => {
            dispatch(unmountDay(val))
        },
        dayChange: (val) => {
            dispatch(dayChange(val))
        }
    }
}

const DaysContainer = connect(mapStateToProps,mapDispatchToProps)(Days);
export default DaysContainer;
