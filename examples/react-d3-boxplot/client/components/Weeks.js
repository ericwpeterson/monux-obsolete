import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import {BoxPlot} from './BoxPlot';
import Days from './Days';
import { weekChange, mountChart } from  '../src/ducks/boxplots'

export class Weeks extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    static propTypes = {
       unmountDays: PropTypes.func.isRequired,
       weekChange: PropTypes.func.isRequired
    };

    componentDidMount() {
        try {
            if ( this.props.app.weeks.unMountChild ) {
                this.props.unmountDays(false);
            }
        } catch (e) {}
    }

    //this function is used to mount the d3 plot with the new data
    componentDidUpdate(prevProps, prevState) {
        try {
            if ( this.props.app.weeks.unMountChild ) {
                this.props.unmountDays(false);
            }
        } catch (e) {}

    }

    clickHandler(d) {
        console.log( 'weekClickHandler called' );
        this.props.weekChange(d[0]);
    }

    render() {
        let days;
        
        if ( this.props.app.days && this.props.app.days.chartData &&
            !this.props.app.weeks.unMountChild ) {
            days = <Days />
        }

        return (
            <div>
                <BoxPlot id='weeks' title='Weeks'
                    data={this.props.app.weeks.chartData} min={this.props.app.weeks.minMax.min}
                    max={this.props.app.weeks.minMax.max}
                    clickHandler={this.clickHandler}
                    currentItem={this.props.app.weeks.currentWeek}
                    classPrefix={'week-'}
                 />
             {days}
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
        unmountDays: (val) => {
            dispatch(mountChart('weeks', val))
        },
        weekChange: (val) => {
            dispatch(weekChange(val))
        }

    }
}

const WeeksContainer = connect(mapStateToProps,mapDispatchToProps)(Weeks);
export default WeeksContainer;
