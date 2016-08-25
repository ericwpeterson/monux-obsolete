import React from 'react';
import {renderChart } from '../src/box-and-whiskers.js';

let boxPlotContainerStyle = {margin: 'auto', width: 800, height: 200,
    borderStyle: 'solid', borderColor: '#e9e7e4', borderRadius: 5, borderWidth: 2
};

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
