import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import {BoxPlot} from './BoxPlot';
import Weeks from './Weeks';
import { monthChange, mountChart } from  '../src/ducks/boxplots'

export class Month extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    static propTypes = {
       unmountWeeks: PropTypes.func.isRequired,
       monthChange: PropTypes.func.isRequired
    };

    componentDidMount() {
        try {
            if ( this.props.app.months.unMountChild ) {
                this.props.unmountWeeks(false);
            }
        } catch (e) {}
    }

    //this function is used to mount the d3 plot with the new data
    componentDidUpdate(prevProps, prevState) {
        try {
            if ( this.props.app.months.unMountChild ) {
                this.props.unmountWeeks(false);
            }
        } catch (e) {}
    }

    clickHandler(d) {
        this.props.monthChange(d[0]);
    }

    render() {
        let boxplot;
        let weeks;

        boxplot = <BoxPlot id='months' title='Months'
            data={this.props.app.months.chartData} min={this.props.app.months.minMax.min}
            max={this.props.app.months.minMax.max}
            clickHandler={this.clickHandler}
            currentItem={this.props.app.months.currentMonth}
            classPrefix={'month-'}
        />

        if ( this.props.app.weeks && this.props.app.weeks.chartData &&
            !(this.props.app.months.unMountChild===true)) {
                weeks = <Weeks />
        }

        return (
            <div>
                <div>
                    {boxplot}
                    {weeks}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        //stats: stats,
        app: state.app.toJS()
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        unmountWeeks: (val) => {
            dispatch(mountChart('months', val))
        },
        monthChange: (val) => {
            dispatch(monthChange(val))
        }

    }
}

const MonthContainer = connect(mapStateToProps,mapDispatchToProps)(Month);
export default MonthContainer;
