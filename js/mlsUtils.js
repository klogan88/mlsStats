//Builds the bar chart.  Can pass in args to select they type of data and axis names for the bar chart.
function buildBar(id, dataUrl, selectedTeam, yAxisName, xAxisName) {

	var margin = {top: 20, right: 20, bottom: 50, left: 40},
    width = 750 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

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

	var svg = d3.select(id).insert("svg:svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.tsv("data/" + dataUrl, type, function(error, data) {
	  x.domain(data.map(function(d) { return d.x; }));
	  y.domain([0, d3.max(data, function(d) { return d.y; })]);

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		.append("text")
		  .attr("x", width/2)
		  .attr("y", 40)
		  .style("text-anchor", "end")
		  .text(xAxisName);

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("y", -10)
		  .style("text-anchor", "middle")
		  .text(yAxisName);

	  svg.selectAll(".bar")
		  .data(data)
		.enter().append("rect")
		  .attr("class", function(d) {
				if(d.x === selectedTeam) {
					return "selectedBar";
				}
				
				return "bar";
		  })
		  .attr("x", function(d) { return x(d.x); })
		  .attr("width", x.rangeBand())
		  .attr("y", function(d) { return y(d.y); })
		  .attr("height", function(d) { return height - y(d.y); })
		  .on("click", function(d) { barClick(d); })
		  .on("mouseover", function(d){return showLabel(d);})
		  .on("mouseout", function(d){return hideLabel();});
	});
};

//Tooltip on mouseover in the bar charts.
function showLabel(d){

	var label = "Goals";
	if(d.goals) {
		label = "Points";
	}
	
	var info = "<span id='clubLabel'>" + d.Club + "</span><br/><hr><span id='typeLabel'>" + label + ": </span><span id='typeValue'>" + d.y + "</span>";
	var windowWidth = $(window).width();
	$('#barTool').html(info).show();
	$(this).mousemove(function (e) {
		var testWidth = e.pageX + 20 + 320;
		if (windowWidth > testWidth) {
			var x = e.pageX + 20;
			var y = e.pageY + 20;
		}
		else {
			var x = e.pageX - 330;
			var y = e.pageY + 20;
		}
		
		$('#barTool').css({
			top:y + 'px',
			left:x + 'px'
		});
	})
};

//Hides the bar tooltip.
function hideLabel(){	
	$("#barTool").hide();
};

//Builds the season table for the particular team selected.
function buildSeasonTable(teamData) {

	var abbr = "";
	
	if(teamData.abbr) {
		abbr = teamData.abbr;
	} else {
		abbr = teamData.x;
	}
	
	d3.tsv("data/" + abbr + "season.tsv", null, function(error, data) {

		processResults(data, teamData);
		
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
};

//Implements the bar click functionality for the bar charts.  Will populate the season data based on bar clicked.
function barClick(data, currTeam) {

	d3.selectAll(".selectedBar")
		.attr("class", "bar");
	
	d3.selectAll(".bar")
		.attr("class", function(d) {
			if(d.x === data.x) {
				return "selectedBar";
			} else {
				return "bar";
			}
		});
	
	$("#teamLabel").text(data.Club);
	
	$("#tableContainer").fadeOut('slow', function() {
		$("#teamLabel").text(data.Club);
		d3.selectAll("#seasonTable table").remove();
		buildSeasonTable(data);
	});
	
	$("#tableContainer").fadeIn('slow');
};

//Determines which games were wins or losses for the selected team
function processResults(data, teamData) {

	var teamName = ""
	
	if(teamData.name) {
		teamName = teamData.name;
	} else {
		teamName = teamData.Club;
	}
	
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
};

//y data is treated as Number type.
function type(d) {
  d.y = +d.y;
  return d;
};