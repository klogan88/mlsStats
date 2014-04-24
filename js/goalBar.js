function buildBar() {

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

	var svg = d3.select("#barChart").insert("svg:svg")
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
		  .text("Goals");

	  svg.selectAll(".bar")
		  .data(data)
		.enter().append("rect")
		  .attr("class", "bar")
		  .attr("x", function(d) { return x(d.abbr); })
		  .attr("width", x.rangeBand())
		  .attr("y", function(d) { return y(d.goals); })
		  .attr("height", function(d) { return height - y(d.goals); });

	});
};

function buildSeasonTable(teamData) {

	d3.tsv("data/" + teamData.abbr + "season.tsv", null, function(error, data) {

		console.log(teamData);
		processResults(data, teamData);
		
		console.log("After process..............");
		console.log(data);
		
		var columns = ["match", "date", "hteam", "result", "ateam", "loc"];
		var table = d3.select("#seasonTable").append("table"),
			tbody = table.append("tbody");
			
		var rows = tbody.selectAll("tr")
			.data(data)
			.enter()
			.append("tr")
				.attr("class", function(d) { 
					return d.outcome; 
				});
			
		var cells = rows.selectAll("td")
			.data(function(row) {
				return columns.map(function(column) {
					return {column: column, value: row[column]};
				});
			})
			.enter()
			.append("td")
				.text(function(d) { return d.value.trim(); });
	});
}

//Determines which games were wins or losses for the selected team
function processResults(data, teamData) {
	var teamName = teamData.name;
	var i = 0;
	var score = [];
	var res = 0;
	
	for(i = 0; i < data.length; i++) {
		score = data[i].result.trim().split("");
		
		var t = data[i].hteam.trim();
		if(teamName === data[i].hteam.trim()) {
			res = Number(score[0]) - Number(score[2]);
		} else {
			res = Number(score[2]) - Number(score[0]);
		}
		
		if(res < 0) {
			data[i].outcome = "loss";
		} else if(res > 0) {
			data[i].outcome = "win";
		} else {
			data[i].outcome = "draw";
		}
	}
	console.log(data);
};

function type(d) {
  d.goals = +d.goals;
  return d;
}