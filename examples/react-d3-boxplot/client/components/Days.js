import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import {BoxPlot} from './BoxPlot';
import LineChart from './LineChart';
import { dayChange, mountChart } from  '../src/ducks/boxplots'

export class Days extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    static propTypes = {
       unmountDay: PropTypes.func.isRequired,
       dayChange: PropTypes.func.isRequired
    };

    componentDidMount() {
        try {
            if ( this.props.app.days.unMountChild ) {
                this.props.unmountDay(false);
            }
        } catch (e) {}
    }

    //this function is used to mount the d3 plot with the new data
    componentDidUpdate(prevProps, prevState) {
        try {
            if ( this.props.app.days.unMountChild ) {
                this.props.unmountDay(false);
            }
        } catch (e) {}
    }

    clickHandler(d) {
        this.props.dayChange(d[0]);
    }

    render() {
        let day;
        
        if ( this.props.app.days && this.props.app.days.currentDay &&
            !this.props.app.days.unMountChild ) {
            day = <LineChart />
        }

        return (
            <div>
                <BoxPlot id='days' title='Days'
                    data={this.props.app.days.chartData} min={this.props.app.days.minMax.min}
                    max={this.props.app.days.minMax.max}
                    clickHandler={this.clickHandler}
                    currentItem={this.props.app.days.currentDay}
                    classPrefix={'day-'}
                />
                {day}
            </div>
        )
    }
};

function mapStateToProps(state) {
    return {
        app: state.app.toJS()
    };
}



const mapDispatchToProps = (dispatch) => {
    return {
        unmountDay: (val) => {
            dispatch(mountChart('days', val));
        },
        dayChange: (day) => {
            dispatch(dayChange(day));
        }
    }
}

const DaysContainer = connect(mapStateToProps,mapDispatchToProps)(Days);
export default DaysContainer;
