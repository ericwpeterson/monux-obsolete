import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import {BoxPlot} from './BoxPlot';
import { dayChange, unmountDay } from  '../src/ducks/day.js'

let lineGraphContainerStyle = {margin: 'auto', width: 800, height: 200,
    borderStyle: 'solid', borderColor: '#e9e7e4', borderRadius: 5, borderWidth: 2
};

export class LineGraph extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
             <div style={lineGraphContainerStyle}>
                {this.props.day}
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
            child = <LineGraph day = {this.props.dayState.currentDay} />
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
