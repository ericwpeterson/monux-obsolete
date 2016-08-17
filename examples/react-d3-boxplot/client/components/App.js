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

let getItems = R.curry((dataPoint, item) => item[dataPoint])

let pickMonthFieldsForChart = (key,obj)  => {
    let tokens = key.split('-')
    return [ tokens[0] + '-' + tokens[1], [obj.min, obj.q1, obj.median, obj.q3, obj.max, ...obj.outliers] ];
}
let pickWeekFieldsForChart = (key,obj)  => [ key, [obj.min, obj.q1, obj.median, obj.q3, obj.max, ...obj.outliers] ];

export class LineGraph extends React.Component {
    constructor() {
        super();
        this.state = {
            collapsed: false
        }
    }

    _collapse(c) {
        this.setState({collapsed: c})
    }

    render() {
        let child;

        if ( !this.state.collapsed ) {
            child =
                <div style={lineGraphContainerStyle}> imagine a line graph
                    <Button onClick={this._collapse.bind(this, true) }> Collapse </Button>
                    <Button onClick={this._collapse.bind(this, false) }> Expand  </Button>
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

    shouldComponentUpdate(props) {
        return false;
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
        this.state = {
            collapsed: true
        }
    }

    _collapse(c) {
        this.setState({collapsed: c})
    }

    clickHandler(d) {
        console.log( 'Day click handler called d =', d)
        this.setState({collapsed: false});
    }

    render() {
        let data = [ ['Sun',[1,10,20,28,30,35,40,50]], ['Mon',[1,10,20,28,30,35,40,50]], ['Tues',[1,10,20,28,30,35,40,50]], ['Wed',[1,10,20,28,30,35,40,50]], ['Thurs',[1,10,20,28,30,35,40,50]], ['Fri',[1,10,20,28,30,35,40,50]], ['Sat',[1,10,20,28,30,35,40,50]] ];
        let min = 1,
            max = 50;

        let child;

        if ( !this.state.collapsed ) {
            child = <LineGraph  />
        }

        return (
            <div style={divStyle}>
                <BoxPlot id='days' title='Days' data={data} min={min} max={max} clickHandler={this.clickHandler} />
                {child}
            </div>

        )
    }
};

export class Weeks extends React.Component {

    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
        this.state = {
            collapsed: true
        }
    }

    clickHandler(d) {
        console.log( 'Week click handler called d =', d)
        this.setState({collapsed: false});
    }

    _collapse(c) {
        this.setState({collapsed: c})
    }

    render() {
        let child;

        if ( !this.state.collapsed ) {
            child = <Days/>
        }

        return (
            <div style={divStyle}>
                <BoxPlot id='weeks' title='Weeks' data={this.props.data} min={this.props.min} max={this.props.max} clickHandler={this.clickHandler} />
                {child}
            </div>
        )
    }
};

export default class App extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
        this.state = {
            collapsed: true,
            currentDataPoint: 'temperatureF'
        }
    }

    static propTypes = {
       getStats: PropTypes.func.isRequired
    };

    clickHandler(d) {
        this.setState({collapsed: false, currentMonth:  d[0] });
    }

    _collapse(c) {
        this.setState({collapsed: c})
    }

    componentDidMount() {
        this.props.getStats();
    }

    dataPointSelector(dp) {
        this.setState({currentDataPoint: dp, forceUnMount: true}, function() { this.setState({forceUnMount: false} )} )
    }

    render() {
        let buttonDivStyle = {margin: 'auto', width: 200};
        let boxplot;

        try {
            if ( this.props.state.monobjects.stats.props.stats.value && !this.state.forceUnMount) {
                let items = R.map( getItems(this.state.currentDataPoint), this.props.state.monobjects.stats.props.stats.value );
                let data = [];
                let keys = R.filter( key => key!=='range',  R.keys(items));
                R.forEach(  key => {
                    data.push( pickMonthFieldsForChart(key, items[key]))
                }, keys);

                let min = this.props.state.monobjects.stats.props.stats.value.range[this.state.currentDataPoint].min;
                let max = this.props.state.monobjects.stats.props.stats.value.range[this.state.currentDataPoint].max;
                boxplot = <BoxPlot id='months' title='Months' data={data} min={min} max={max} clickHandler={this.clickHandler} />
            }

        } catch (e) {
            //console.log(e);
        }

        let child;

        if ( !this.state.collapsed ) {
            let items = R.map( getItems(this.state.currentDataPoint), this.props.state.monobjects.stats.props.stats.value['2016-07-01'].children );
            let data = [];
            let keys = R.filter( key => key!=='range',  R.keys(items));
            R.forEach(  key => {
                data.push( pickWeekFieldsForChart(key, items[key]))
            }, keys);

            let month = this.props.state.monobjects.stats.props.stats.value['2016-07-01'];
            let min = month.range[this.state.currentDataPoint].min;
            let max = month.range[this.state.currentDataPoint].max;

            child = <Weeks data={data} min={min} max={max} collapsed={this.state.collapsed} month={this.state.currentMonth} dataPoint={this.state.currentDataPoint} stats={this.props.state.monobjects.stats.props.stats.value} />;
        }

        return (
            <div>
                <div style={buttonDivStyle}>
                    <Button active={this.state.currentDataPoint==='temperatureF'?true:false} onClick={this.dataPointSelector.bind(this, 'temperatureF') }> Temp. </Button>
                    <Button onClick={this.dataPointSelector.bind(this, 'relativeHumidity') }> RH  </Button>
                    <Button onClick={this.dataPointSelector.bind(this, 'cO2Level') }> C02  </Button>
                </div>
                <div style={divStyle}>
                    {boxplot}
                    {child}
                </div>
            </div>
        )
    }
};

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
