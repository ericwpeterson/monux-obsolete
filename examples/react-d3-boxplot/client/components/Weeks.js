import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import {BoxPlot} from './BoxPlot';
import Days from './Days';
import { weekChange, unmountDays } from  '../src/ducks/week.js'
import toD3BoxPlot, {toD3BoxPlotMinMax} from '../src/to-d3-boxplot'

export class Weeks extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    static propTypes = {
       unmountDays: PropTypes.func.isRequired,
       weekChange: PropTypes.func.isRequired
    };

    //this function is used to mount the d3 plot with the new data
    componentDidUpdate(prevProps, prevState) {
      try {
        if ( this.props.weekState.unmountDays === true  ) {
          this.props.unmountDays(false);
        }
      } catch(e) {}
    }

    clickHandler(d) {
        this.props.weekChange(d[0]);
    }

    render() {
        let child;

        if ( this.props.weekState.currentWeek   &&  !this.props.weekState.unmountDays  ) {
            try {
                let data = toD3BoxPlot(this.props.dataPoint)(this.props.stats[this.props.weekState.currentWeek].children);
                let plotMinMax = toD3BoxPlotMinMax(data);

                child = <Days data={data} min={plotMinMax.min}
                            max={plotMinMax.max} month={this.props.month}
                            currentWeek={this.props.weekState.currentWeek}
                            dataPoint={this.props.dataPoint}
                            stats={this.props.stats}
                        />;

            } catch (e) {}
        }

        return (
            <div>
                <BoxPlot id='weeks' title='Weeks' data={this.props.data} min={this.props.min}
                    max={this.props.max} clickHandler={this.clickHandler}
                 />
                {child}
            </div>
        )
    }
};


function mapStateToProps(state) {
  return {
        weekState: state.weekReducer.toJS()
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        unmountDays: (val) => {
            dispatch(unmountDays(val))
        },
        weekChange: (val) => {
            dispatch(weekChange(val))
        }

    }
}

const WeeksContainer = connect(mapStateToProps,mapDispatchToProps)(Weeks);
export default WeeksContainer;
