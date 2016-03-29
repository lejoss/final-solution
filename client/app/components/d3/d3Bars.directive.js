/**
 * Created by lejoss on 17/11/15.
 */
(function() {
   'use strict';

    angular
        .module('final-solution')
        .directive('d3Bars', d3Bars);

    //d3Bars.$inject = [''];

    function d3Bars() {
        return {
            restrict: 'E',
            // Add two-way binding
            scope: {
                data: '='
            },
            replace: true,
            // Add linking function to draw graph
            link: function(scope, element) {

                // Define margins
                var margin = {top: 15, right: 60,bottom: 150, left: 100},
                    width  = 400 - margin.left - margin.right,
                    height = 420 - margin.top - margin.bottom;

                // create svg element and add it to the DOM
                var svg = d3.select(element[0])
                    .append("svg")
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .attr('id', 'svg_id')
                    .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.2);
                var y = d3.scale.linear().rangeRound([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .tickFormat(d3.format(".0%"));

                // Render function to draw the graph
                scope.render = function(data) {

                    // If data doesn't exist, return nothing
                    if (data === undefined) {
                        return ;
                    }

                    // Remove all svg elements before re-drawing graph
                    svg.selectAll("*").remove();

                    data.forEach(function(d) {
                        d.value = +d.value;
                    });

                    x.domain(data.map(function(d) { return d.cohortName; }));
                    y.domain([0, d3.max(data, function(d) { return d.value; })]);

                    svg.selectAll('g.axis').remove();
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .attr("fill", "#000")
                        .call(xAxis)
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .style("font-size","12px")
                        .attr("dx", "1em")
                        .attr("dy", ".7em")
                        .attr("transform", function(d) {
                            return "rotate(-15)";
                        });

                    svg.append("g")
                        .attr("class", "y axis")
                        .attr("fill", "#000")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", -70)
                        .attr("x", -30)
                        .attr("dy", ".6em")
                        .style("text-anchor", "end")
                        .attr("fill", "#000")
                        .text("% of standards met");

                    var bars = svg.selectAll(".bar")
                        .data(data)
                        .enter().append("rect")
                        .style("fill", "#FF4081")
                        .attr("x", function(d) { return x(d.cohortName); })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) { return y(d.value); })
                        .attr("height", function(d) { return height - y(d.value); });

                    svg.selectAll("rect")
                        .data(data)
                        .enter()
                        .append("text")
                        .attr("x", x.rangeBand() / 2)
                        .attr("y", function(d) { return (d.value * 100); })
                        .style("text-anchor", "middle")
                        .style("font-size", "10px")
                        .text(function(d) {return (d.value * 100); });

                    svg.selectAll(".label")
                        .data(data)
                        .enter().append("svg:text")
                        .attr("class", "label")
                        .attr("x", function(d) {
                            return x(d.cohortName) + (x.rangeBand() / 3) - 5;
                        })
                        .attr("y", function(d) {
                            return y(d.value) + 40;
                        })
                        .text(function(d) {
                            return (d.value * 100).toFixed() + "%";
                        });
                };

                // $watch function to watch data for changes and re-render graph when changes detected
                scope.$watch('data', function(){
                    scope.render(scope.data);
                });
            }
        };
    }
})();