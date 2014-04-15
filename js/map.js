var locations = 
[	
	{ code:'SJC', name: 'San Jose', coords: {latitude: '37.338581', longitude:'-121.885567'}},
	{ code:'BXB', name: 'Boxborough', coords: {latitude: '42.484009', longitude:'-71.514099'}},
	{ code:'LON', name: 'London', coords: {latitude: '51.506321', longitude:'-0.127140'}},
	{ code:'BGL', name: 'Bangalore', coords: {latitude: '12.966970', longitude:'77.587280'}},	
	{ code:'HKG', name: 'Hong Kong', coords: {latitude: '22.336283', longitude:'114.186829'}}	
]

//The info for each view displayed at the bottom
var mapInfo = 'This Visualization contains data of  <span class="tag">21,932 Audio Endpoints</span>  to demonstrate data binding using <span class="tag">d3.js</span>.<br/><br/>Mouseover the circles for more information / Click to go to the next level.',
	packInfo = 'The three levels of circles represent <span class="tag"> Location Data, Device Pool data and EndPoint Data</span> respectively. Endpoints are color coded based on their status (AllFine/Error). <br/><br/>MouseOver each level for more info / Click to zoom in';
drawMap();
drawLocations();

function drawMap(){
    var mapRfl = Raphael('map', 1000, 400);
                  
    var r = mapRfl;
    r.rect(0, 0, 1000, 400, 0).attr({
        stroke: "none",                    
    });
    var over = function () {
        this.c = this.c || this.attr("fill");
        this.stop().animate({fill: "#000"}, 100);
    },
        out = function () {
            this.stop().animate({fill: this.c}, 100);
        };
    //START THE SET OF COUNTRIES
    r.setStart();
    var hue = Math.random();
    //DRAW THE COUNTRIES
    for (var country in worldmap.shapes) {        
        r.path((worldmap.shapes[country])).attr({stroke: "#002b33", fill: "#002b33", "stroke-opacity": 1});
    }
    //FINISH THE SET OF COUNTRIES
    var world = r.setFinish();
    world.hover(over, out);    

    world.getXY = function (lat, lon) {                    
    	return {
	        cx: lon * 2.6938 + 465.4,
	        cy: lat * -2.6938 + 227.066
    	};
	};
}

function drawLocations(){
	var labels = d3.select("#map > svg").selectAll("text")
	   .data(locations).enter().append("svg:text")
	   .attr("x", function(d) { return (d.coords.longitude * 2.6938 + 465.4); })
       .attr("y", function(d) { return (d.coords.latitude * -2.6938 + 227.066); })
       .attr("dy", ".35em")
       .attr("text-anchor", "middle")
       .attr("fill", "white")       
       .text(function(d) { return d.code; });

	var circles = d3.select("#map > svg").selectAll("circle")
	   .data(locations).enter().append("svg:circle")
	   .attr("cx", function(d){return (d.coords.longitude * 2.6938 + 465.4);})
	   .attr("cy", function(d){return (d.coords.latitude * -2.6938 + 227.066);})
	   .attr("r", function(d){return getRadius(d.code);})
	   .attr("stroke", "#7A7600" ).attr("stroke-width", '1.5')
	   .attr("fill", "rgba(48, 46, 1, 0.3)")
	   .on("click", function(d) {return locClick(d)})
	   .on("mouseover", function(d){return showLabel(d.code);})
       .on("mouseout", function(d){return hideLabel();});
}