import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import {BoxPlot} from './BoxPlot';
import Weeks from './Weeks';
import { monthChange, unmountWeeks } from  '../src/ducks/month.js'
import toD3BoxPlot from '../src/to-d3-boxplot'

let divStyle = {}

export class Month extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    static propTypes = {
       unmountWeeks: PropTypes.func.isRequired,
       monthChange: PropTypes.func.isRequired
    };

    componentDidUpdate(prevProps, prevState) {
        try {
            if ( this.props.monthState.unmountWeeks === true  ) {
                this.props.unmountWeeks(false);
            }
        } catch(e) {}
    }

    clickHandler(d) {
        this.props.monthChange(d[0]);
    }

    render() {
        let boxplot;
        let child;

        let data = toD3BoxPlot(this.props.dataPoint)(this.props.stats);

        boxplot = <BoxPlot id='months' title='Months'
                    data={data} min={this.props.stats.range[this.props.dataPoint].min}
                    max={this.props.stats.range[this.props.dataPoint].max}
                    clickHandler={this.clickHandler}
                    />


        //the second half takes care of rendering the child box item
        if ( this.props.monthState.currentMonth   &&  !this.props.monthState.unmountWeeks  ) {

            try {
                let data = toD3BoxPlot(this.props.dataPoint)(this.props.stats[this.props.monthState.currentMonth].children);
                let month = this.props.stats[this.props.monthState.currentMonth];

                child = <Weeks data={data} min={month.range[this.props.dataPoint].min}
                            max={month.range[this.props.dataPoint].max} month={this.props.monthState.currentMonth}
                            dataPoint={this.props.dataPoint}
                            stats={this.props.stats[this.props.monthState.currentMonth].children}
                        />;

            } catch(e) {console.log(e)}
        }

        return (
            <div>
                <div style={divStyle}>
                    {boxplot}
                    {child}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
        monthState: state.monthReducer.toJS()
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        unmountWeeks: (val) => {
            dispatch(unmountWeeks(val))
        },
        monthChange: (val) => {
            dispatch(monthChange(val))
        }

    }
}

const MonthContainer = connect(mapStateToProps,mapDispatchToProps)(Month);
export default MonthContainer;
