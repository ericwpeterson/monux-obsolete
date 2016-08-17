import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import { get, set, call, watch, unwatch } from '../src/monobject-actions.js';
import { Button } from 'react-bootstrap';

var Box = require ('../src/box-and-whiskers.js');

//function renderChart ( props ) {
function renderChart(title,containerName,data,min,max,lineChartAvailableOnClick) {
    
    //allow the container to specify the width
    //var containerWidth = document.getElementById('chartContainer').offsetWidth;

    var containerWidth = 700
    
    var labels = true; // show the text labels beside individual boxplots?
    var margin = {top: 30, right: 50, bottom: 70, left: 50};
    var width = containerWidth - margin.left - margin.right;
    var height = 280 - margin.top - margin.bottom;
    var chart = Box()
        .whiskers(null)
        .height(height)
        .domain([min, max])
        .showLabels(labels);

    var svg = d3.select("#" + containerName).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "box")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // the x-axis
    var x = d3.scale.ordinal()
        .domain( data.map(function(d) { return d[0]; } ) )
        .rangeRoundBands([0 , width], 0.7, 0.3);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // the y-axis
    var y = d3.scale.linear()
        .domain([min, max])
        .range([height + margin.top, 0 + margin.top]);

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    
    // draw the boxplots
    svg.selectAll(".box")
      .data(data)
      .enter().append("g")
        .on("click", function(d){
            if (lineChartAvailableOnClick) {    
                PubSub.publish('whisker.clicked', d);
                svg.selectAll(".lineChartAvailableOnClick").classed("lineChartAvailableOnClick", false);
            }
        })        
        .classed("lineChartAvailableOnClick", lineChartAvailableOnClick)
        .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
      .call(chart.width(x.rangeBand()));

    // add a title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 + (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")        
        .text(title);

     // draw y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text") // and text1
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style("font-size", "16px")
          .text("");

    // draw x axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
      .call(xAxis)
      .append("text")             // text label for the x axis
        .attr("x", (width / 2) )
        .attr("y",  20 )
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("");
}

























export default class App extends React.Component {
    
    static propTypes = {
       get: PropTypes.func.isRequired,
       set: PropTypes.func.isRequired,
       set2: PropTypes.func.isRequired,
       watch: PropTypes.func.isRequired,
       unWatch: PropTypes.func.isRequired,
       state: PropTypes.object.isRequired,
       getStats: PropTypes.func.isRequired       
    };
    
    render() {
        
        console.log('render() this.props.state=', this.props.state);

        let style = {};

        style.backgroundColor = 'white';
        style.padding = 100;
        style.margin = 'auto';
        style.width = '100%'
        style.height = '100%';

        let buttonDivStyle = {margin: 'auto', width: 100};

        let boxPlotContainerStyle = {margin: 'auto', width: 1000, height: 600, borderStyle: 'solid' };

        //renderChart(title,container,data,min,max,lineChartAvailableOnClick)



        try {
            if ( this.props.state.monobjects.stats.props.color.value ) {
                style.backgroundColor = this.props.state.monobjects.stats.props.color.value;                
            }            
        } catch(e) {}

        return (

            
            <div style={style}>                
                <div style={{margin:'auto', width: 100}}>                
                    <Button onClick={this.props.get}> Get Color </Button>                    
                </div>

                <div style={buttonDivStyle}>                
                    <Button onClick={this.props.set}> Set Color = blue </Button>                    
                </div>
                <div style={buttonDivStyle}>                
                    <Button onClick={this.props.set2}> Set Color = green </Button>                    
                </div>
                <div style={buttonDivStyle}>                
                    <Button onClick={this.props.watch}> Watch color </Button>                    
                </div>
                <div style={buttonDivStyle}>                
                    <Button onClick={this.props.unWatch}> Un-Watch color </Button>                    
                </div>
                <div style={buttonDivStyle}>                
                    <Button onClick={this.props.getStats}> Get Stats </Button>                    
                </div>

                <div style={boxPlotContainerStyle} ref={(c) => this.boxContainer = c} > </div>
                
            </div>
        );
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
        get: () => {
            dispatch(get('stats', 'color'));
        },
        set: () => {
            dispatch(set('stats', 'color', 'blue'));
        },
        set2: () => {
            dispatch(set('stats', 'color', 'green'));
        },
        watch: () => {
            dispatch(watch('stats', 'color'));
        },
        unWatch: () => {
            dispatch(unwatch('stats', 'color'));
        },

        getStats: () => {
            dispatch(get('stats', 'stats'));
        }
    }
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
export default AppContainer;































