
import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import R, {map} from 'ramda';


let divStyle = {}
let lineGraphContainerStyle = {
    margin: 'auto', width: 800, height: 200, borderStyle: 'solid',
    borderColor: '#e9e7e4', borderRadius: 5, borderWidth: 2
};

let boxPlotContainerStyle = {margin: 'auto', width: 800, height: 200,
    borderStyle: 'solid', borderColor: '#e9e7e4', borderRadius: 5, borderWidth: 2
};

let buttonDivStyle = {margin: 'auto', width: 200};

let getItems = R.curry((dataPoint, item) => item[dataPoint])
let pickFields = R.curry((obj, key)  => [ key,
                                            [ obj[key].min, obj[key].q1, obj[key].median,
                                                obj[key].q3, obj[key].max,
                                                ...obj[key].outliers
                                            ]
                                        ])


export class Weeks extends React.Component {

    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
        this.state = {
            currentWeek: null,
            unMountChild: false
        }
    }

    clickHandler(d) {
        this.setState({ currentWeek: d[0], unMountChild: true }, function() { this.setState( { unMountChild: false  })} );
    }

    render() {
        let child;

        if ( !this.state.unMountChild  && this.state.currentWeek) {
            try {
                let data = getChartData(this.props.dataPoint)(this.props.stats[this.state.currentWeek].children);
                let week = this.props.stats[this.state.currentWeek];

                child = <Days data={data} min={week.range[this.props.dataPoint].min}
                            max={week.range[this.props.dataPoint].max} month={this.props.month}
                            currentWeek={this.state.currentWeek}
                            dataPoint={this.props.dataPoint}
                            stats={this.props.stats}
                        />;

            } catch (e) {}
        }

        return (
            <div style={divStyle}>
                <BoxPlot id='weeks' title='Weeks' data={this.props.data} min={this.props.min}
                    max={this.props.max} clickHandler={this.clickHandler}
                 />
                {child}
            </div>
        )
    }
};
