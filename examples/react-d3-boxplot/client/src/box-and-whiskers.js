// Inspired by http://informationandvisualization.de/blog/box-plot

export let D3box = function(min, max) {
    var width = 1;
    var height = 1;
    var duration = 0;
    var domain = null;
    var value = Number;
    //whether or not to show text labels
    var showLabels = true;
    var curBar = 1;
    var tickFormat = null;

    // For each small multiple…
    function box(g) {
        var currentBox;

        g.each(function(data, i) {
            var d = data[1];
            var g = d3.select(this);
            var n = d.length;

            var currentBox = i;
            var quartileData =  [d[1], d[2], d[3]];
            var whiskerData = [d[0], d[4]];
            var odata = d.splice(5, d.length - 3);

            var isValid = (d[0] && d[1] && d[2] && d[3] && d[4]);

            // Compute the new x-scale.
            var x1 = d3.scale.linear()
                .domain(domain && domain.call(this, d, i) || [min, max])
                .range([height, 0]);

            // Retrieve the old x-scale, if this is an update.
            var x0 = this.__chart__ || d3.scale.linear()
                .domain([0, Infinity])
                // .domain([0, max])
                .range(x1.range());

            // Stash the new scale.
            this.__chart__ = x1;

            // Note: the box, median, and box tick elements are fixed in number,
            // so we only have to handle enter and update. In contrast, the outliers
            // and other elements are variable, so we need to exit them! Variable
            // elements also fade in and out.

            // Update center line: the vertical line spanning the whiskers.
            var center = g.selectAll("line.center")
                .data(whiskerData ? [whiskerData] : []);

            if (isValid) {
                //vertical line
                center.enter().insert("line", "rect")
                    .attr("class", "center")
                    .attr("x1", width / 2)
                    .attr("y1", function(d) { return x0(d[0]); })
                    .attr("x2", width / 2)
                    .attr("y2", function(d) { return x0(d[1]); })
                    .style("opacity", 1e-6)
                    .transition()
                        .duration(duration)
                        .style("opacity", 1)
                        .attr("y1", function(d) { return x1(d[0]); })
                        .attr("y2", function(d) { return x1(d[1]); });

                center.transition()
                    .duration(duration)
                    .style("opacity", 1)
                    .attr("y1", function(d) { return x1(d[0]); })
                    .attr("y2", function(d) { return x1(d[1]); });

                center.exit().transition()
                    .duration(duration)
                    .style("opacity", 1e-6)
                    .attr("y1", function(d) { return x1(d[0]); })
                    .attr("y2", function(d) { return x1(d[1]); })
                    .remove();

                // Update innerquartile box.
                var box = g.selectAll("rect.box")
                    .data([quartileData]);

                box.enter().append("rect")
                    .attr("class", "box")
                    .attr("x", 0)
                    .attr("y", function(d) { return x0(d[2]); })
                    .attr("width", width)
                    .attr("height", function(d) { return x0(d[0]) - x0(d[2]); })
                    .transition()
                        .duration(duration)
                        .attr("y", function(d) { return x1(d[2]); })
                        .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

                box.transition()
                    .duration(duration)
                    .attr("y", function(d) { return x1(d[2]); })
                    .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

                // Update median line.
                var medianLine = g.selectAll("line.median")
                    .data([quartileData[1]]);

                medianLine.enter().append("line")
                    .attr("class", "median")
                    .attr("x1", 0)
                    .attr("y1", x0)
                    .attr("x2", width)
                    .attr("y2", x0)
                    .transition()
                        .duration(duration)
                        .attr("y1", x1)
                        .attr("y2", x1);

                medianLine.transition()
                    .duration(duration)
                    .attr("y1", x1)
                    .attr("y2", x1);

                // Update whiskers.
                var whisker = g.selectAll("line.whisker")
                    .data(whiskerData || []);

                whisker.enter().insert("line", "circle, text")
                    .attr("class", "whisker")
                    .attr("x1", 0)
                    .attr("y1", x0)
                    .attr("x2", 0 + width)
                    .attr("y2", x0)
                    .style("opacity", 1e-6)
                    .transition()
                        .duration(duration)
                        .attr("y1", x1)
                        .attr("y2", x1)
                        .style("opacity", 1);

                whisker.transition()
                    .duration(duration)
                    .attr("y1", x1)
                    .attr("y2", x1)
                    .style("opacity", 1);

                whisker.exit().transition()
                    .duration(duration)
                    .attr("y1", x1)
                    .attr("y2", x1)
                    .style("opacity", 1e-6)
                    .remove();

                if (odata) {
                    // Update outliers.
                    var outlier = g.selectAll("circle")
                        .data(odata, Number);
                    outlier.enter().insert("circle")
                        .attr("class", "outlier")
                        .attr("r", 5)
                        .attr("cx", width / 2)
                        .attr("cy", function(i) {
                            return x1(i);
                        });
                }

                // Compute the tick format.
                var format = tickFormat || x1.tickFormat(8);

                // Update box ticks.
                var boxTick = g.selectAll("text.box")
                    .data(quartileData);

                if (showLabels === true) {
                    boxTick.enter().append("text")
                        .attr("class", "box")
                        .attr("dy", ".3em")
                        .attr("dx", function(d, i) { return i & 1 ? 6 : -6; })
                        .attr("x", function(d, i) { return i & 1 ? +width : 0; })
                        .attr("y", x0)
                        .attr("text-anchor", function(d, i) { return i & 1 ? "start" : "end"; })
                        .text(format)
                        .transition()
                        .duration(duration)
                        .attr("y", x1);
                }

                boxTick.transition()
                    .duration(duration)
                    .text(format)
                    .attr("y", x1);

                // Update whisker ticks. These are handled separately from the box
                // ticks because they may or may not exist, and we want don't want
                // to join box ticks pre-transition with whisker ticks post-.
                var whiskerTick = g.selectAll("text.whisker")
                    .data(whiskerData || []);

                if (showLabels === true) {
                    whiskerTick.enter().append("text")
                        .attr("class", "whisker")
                        .attr("dy", ".3em")
                        .attr("dx", 6)
                        .attr("x", width)
                        .attr("y", x0)
                        .text(format)
                        .style("opacity", 1e-6)
                        .transition()
                        .duration(duration)
                        .attr("y", x1)
                        .style("opacity", 1);
                }
                whiskerTick.transition()
                    .duration(duration)
                    .text(format)
                    .attr("y", x1)
                    .style("opacity", 1);

                whiskerTick.exit().transition()
                    .duration(duration)
                    .attr("y", x1)
                    .style("opacity", 1e-6)
                    .remove();
            }
        });
        d3.timer.flush();
    }

    box.width = function(x) {
        if (!arguments.length) {
            return width;
        }
        width = x;
        return box;
    };

    box.height = function(x) {
        if (!arguments.length) {
            return height;
        }
        height = x;
        return box;
    };

    box.tickFormat = function(x) {
        if (!arguments.length) {
            return tickFormat;
        }
        tickFormat = x;
        return box;
    };

    box.duration = function(x) {
        if (!arguments.length) {
            return duration;
        }
        duration = x;
        return box;
    };

    box.domain = function(x) {
        if (!arguments.length) {
            return domain;
        }
        domain = x === null ? x : d3.functor(x);
        return box;
    };

    box.value = function(x) {
        if (!arguments.length) {
            return value;
        }
        value = x;
        return box;
    };

    box.whiskers = function(x) {
        if (!arguments.length) {
            return whiskers;
        }
        //FIXME
        //whiskers = x;
        return box;
    };

    box.showLabels = function(x) {
        if (!arguments.length) {
            return showLabels;
        }
        showLabels = x;
        return box;
    };

    box.quartiles = function(x) {
        if (!arguments.length) {
            return quartiles;
        }
        quartiles = x;
        return box;
    };
    return box;
};

export function renderChart(title, containerName, data, min, max, clickHandler, currentItem, classPrefix) {
    //allow the container to dictate the width
    var containerWidth = document.getElementById(containerName).offsetWidth;
    var containerHeight = document.getElementById(containerName).offsetHeight;

    let _currentItem;

    if (currentItem) {
        _currentItem = '#' + classPrefix + currentItem;
    }

    var labels = true; // show the text labels beside individual boxplots?
    var margin = {top: 30, right: 50, bottom: 70, left: 50};
    var width = containerWidth - margin.left - margin.right;

    var height = containerHeight - margin.top - margin.bottom;

    var chart = new D3box(min,max)
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
        .domain(data.map(function(d) { return d[0]; }))
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
    .orient("left")
    .ticks(5);

    // draw the boxplots
    svg.selectAll(".box")
      .data(data)
      .enter().append("g")
        .on('mouseover', function(d) {
            d3.select(this).style("cursor", "pointer");
        })
        .on('mouseout', function(d) {
            d3.select(this).style("cursor", "default");
        })
        .on("click", function(d) {
            if (_currentItem) {
                d3.selectAll(_currentItem).style("font-weight", 'normal');
                d3.selectAll(_currentItem).style("text-decoration", 'initial');
            }
            _currentItem = '#' + classPrefix + d[0];
            d3.selectAll('#' + classPrefix + d[0]).style("font-weight", 'bold');
            d3.selectAll('#' + classPrefix + d[0]).style("text-decoration", 'underline');
            clickHandler(d);
        })
        .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; })
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
      .attr("id", "xaxis")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
      .call(xAxis)
      .append("text")
        .attr("x", (width / 2))
        .attr("y",  20)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("");

    svg.selectAll('#xaxis').selectAll('.tick')
        .attr("id", function(d) {
            let id =  classPrefix + d;
            return id;
        });

    //set item active
    if (_currentItem) {
        d3.selectAll(_currentItem).style("font-weight", 'bold');
        d3.selectAll(_currentItem).style("text-decoration", 'underline');
    }
}
