import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import R, {map} from 'ramda';

import {BoxPlot} from './BoxPlot';

import Weeks from './Weeks';
import { monthChange } from  '../src/month-actions.js'

let divStyle = {}
let getItems = R.curry((dataPoint, item) => item[dataPoint])
let pickFields = R.curry((obj, key)  => [ key,
                                            [ obj[key].min, obj[key].q1, obj[key].median,
                                                obj[key].q3, obj[key].max,
                                                ...obj[key].outliers
                                            ]
                                        ])
let iterateObjectKeys = (obj) => R.map(pickFields(obj), R.keys(obj))
let filterFn = obj =>  obj.max && obj.min && obj.median && obj.q1 && obj.q3 && obj.outliers
let getChartData = (dataPoint) => R.compose( iterateObjectKeys, R.filter(filterFn), R.map( getItems(dataPoint)));



export class Month extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
      console.log('componentDidUpdate prev', prevProps.appState);
      console.log('componentDidUpdate current', this.props.appState);

      try {
        if ( this.props.monthState.unmountMonth === true  ) {
          this.props.unmountMonth(false);
        }
      } catch(e) {}
    }


    clickHandler(d) {
        //this.setState({ currentMonth: d[0], unMountChild: true }, function() { this.setState( { unMountChild: false  })} );
        this.props.monthChange(d[0]);
    }

    render() {
        let boxplot;
        let child;

        console.log( 'month this.props', this.props);
        console.log( 'month this.props.appState', this.props.appState);
        console.log( 'month this.state', this.state);





        let data = getChartData(this.props.dataPoint)(this.props.stats);

        console.log( 'data=', data);

        boxplot = <BoxPlot id='months' title='Months'
                    data={data} min={this.props.stats.range[this.props.dataPoint].min}
                    max={this.props.stats.range[this.props.dataPoint].max}
                    clickHandler={this.clickHandler}
                    />


        //the second half takes care of rendering the child box item
        if (!( this.props.monthState || !this.props.currentMonth )) {


            try {
                console.log('HERE')
                let data = getChartData(this.props.dataPoint)(this.props.stats[this.state.currentMonth].children);
                let month = this.props.stats[this.props.currentMonth];

                child = <Weeks data={data} min={month.range[this.props.dataPoint].min}
                            max={month.range[this.props.dataPoint].max} month={this.props.mpnth.currentMonth}
                            dataPoint={this.props.dataPoint}
                            stats={this.props.stats[this.state.currentMonth].children}
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

  console.log( 'mapStateToProps', state );

  return {
        monthState: state.monthReducer.toJS(),
        appState: state.appReducer.toJS()
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        unmountMonth: (val) => {
            dispatch(unmountMonth(val))
        },
        monthChange: (val) => {
            dispatch(monthChange(val))
        }

    }
}

const MonthContainer = connect(mapStateToProps,mapDispatchToProps)(Month);
export default MonthContainer;
