var margin = {top: 20, right: 20, bottom: 50, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/mlsStats.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.abbr; }));
  y.domain([0, d3.max(data, function(d) { return d.goals; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	.append("text")
	  .attr("x", width/2)
	  .attr("y", 40)
	  .style("text-anchor", "end")
	  .text("Team");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("y", -10)
      .style("text-anchor", "middle")
      .text("Goals!!!");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.abbr); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.goals); })
      .attr("height", function(d) { return height - y(d.goals); });

});

function type(d) {
  d.goals = +d.goals;
  return d;
}