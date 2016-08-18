import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import { get, set, call, watch, unwatch } from '../src/monobject-actions.js';
import { Button } from 'react-bootstrap';
import {renderChart } from '../src/box-and-whiskers.js';
import R, {map} from 'ramda';

let divStyle = {}
let lineGraphContainerStyle = {margin: 'auto', width: 800, height: 200, borderStyle: 'solid', borderColor: '#e9e7e4', borderRadius: 5, borderWidth: 2 };
let boxPlotContainerStyle = {margin: 'auto', width: 800, height: 200, borderStyle: 'solid', borderColor: '#e9e7e4', borderRadius: 5, borderWidth: 2 };
let buttonDivStyle = {margin: 'auto', width: 200};

let getItems = R.curry((dataPoint, item) => item[dataPoint])
let pickFields = R.curry((obj, key)  => [ key, [ obj[key].min, obj[key].q1, obj[key].median, obj[key].q3, obj[key].max, ...obj[key].outliers]])
let iterateObjectKeys = (obj) => R.map(pickFields(obj), R.keys(obj))
let filterFn = obj =>  obj.max && obj.min && obj.median && obj.q1 && obj.q3 && obj.outliers
let getChartData = (dataPoint) => R.compose( iterateObjectKeys, R.filter(filterFn), R.map( getItems(dataPoint)));
let pickFieldsForChart = (key,obj)  => [ key, [obj.min, obj.q1, obj.median, obj.q3, obj.max, ...obj.outliers] ];

export class LineGraph extends React.Component {
    constructor() {
        super();
    }
    render() {
        let child;

        if ( !this.state.collapsed ) {
            child =
                <div style={lineGraphContainerStyle}> imagine a line graph here
                </div>
        }
        return (
            <div style={divStyle}>
                {child}
            </div>
        );
    }
}

export class BoxPlot extends React.Component {

    componentDidMount() {
        renderChart(this.props.title, this.props.id, this.props.data, this.props.min, this.props.max, this.props.clickHandler);
    }

    render() {
        return (
            <div>
                <div id={this.props.id} style={boxPlotContainerStyle} > </div>
            </div>
        );
    }
}

export class Days extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(d) {
    }

    render() {
        //TODO: This is where we would create a line graph child
        return (
            <div style={divStyle}>
                <BoxPlot id='days' title='Days' data={this.props.data} min={this.props.min} max={this.props.max} clickHandler={this.clickHandler} />
            </div>
        )
    }
};

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
                <BoxPlot id='weeks' title='Weeks' data={this.props.data} min={this.props.min} max={this.props.max} clickHandler={this.clickHandler} />
                {child}
            </div>
        )
    }
};

export class Month extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
        this.state = {
            currentMonth: null,
            unMountChild: false,
            unMountSelf: false
        }
    }

    clickHandler(d) {
        this.setState({collapsed: false, currentMonth:  d[0], unMountChild: true }, function() { this.setState( { unMountChild: false})} );
    }

    render() {
        let boxplot;
        let child;


        let data = getChartData(this.props.dataPoint)(this.props.stats);

        boxplot = <BoxPlot id='months' title='Months'
                    data={data} min={this.props.stats.range[this.props.dataPoint].min} max={this.props.stats.range[this.props.dataPoint].max}
                    clickHandler={this.clickHandler}
                    />

        //the second half takes care of rendering the child box item
        if (!( this.state.unMountChild || !this.state.currentMonth )) {
            try {

                let data = getChartData(this.props.dataPoint)(this.props.stats[this.state.currentMonth].children);
                let month = this.props.stats[this.state.currentMonth];

                child = <Weeks unMount={this.state.unMountChild}
                            data={data} min={month.range[this.props.dataPoint].min}
                            max={month.range[this.props.dataPoint].max} month={this.state.currentMonth}
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

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            currentDataPoint: 'temperatureF',
            unMountChild: false
        }
    }

    static propTypes = {
       getStats: PropTypes.func.isRequired
    };


    componentDidMount() {
        this.props.getStats();
    }

    dataPointSelector(dp) {
        this.setState({currentDataPoint: dp, unMountChild: true}, function() { this.setState({unMountChild: false} )} )
    }


    render() {
        let month;

        try {
            if ( this.props.state.monobjects.stats.props.stats.value ) {
               if ( !this.state.unMountChild ) {
                month = <Month stats={this.props.state.monobjects.stats.props.stats.value} dataPoint={this.state.currentDataPoint} />
               }

            }
        } catch(e) {}

        return (
            <div>
                <div style={buttonDivStyle}>
                    <Button active={this.state.currentDataPoint==='temperatureF'?true:false} onClick={this.dataPointSelector.bind(this, 'temperatureF') }> Temp. </Button>
                    <Button onClick={this.dataPointSelector.bind(this, 'relativeHumidity') }> RH  </Button>
                    <Button onClick={this.dataPointSelector.bind(this, 'cO2Level') }> C02  </Button>
                </div>
                {month}
            </div>
        )
    }
}

function mapState(state) {
    let ret = state;
    try {
        state.toJS();
    } catch(e) {
        console.log(e);
    }

    return ret;
}


function mapStateToProps(state) {
    return {
        state: state.toJS()
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getStats: () => {
            dispatch(get('stats', 'stats'));
        }
    }
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
export default AppContainer;
