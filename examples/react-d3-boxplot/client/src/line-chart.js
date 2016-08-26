import R, {map} from 'ramda';

export function renderChart(containerName, data) {

    //allow the container to dictate the width
    var containerWidth = document.getElementById(containerName).offsetWidth;
    var containerHeight = document.getElementById(containerName).offsetHeight;


    var margin = {top: 30, right: 50, bottom: 35, left: 50},
        width = containerWidth - margin.left - margin.right - 10,
        height = containerHeight - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.val); });

    var svg = d3.select('#'+containerName).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain([data[0].date, data[data.length-1].date ])
        y.domain([0, d3.max(data, function(d) { return d.val; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);




}
