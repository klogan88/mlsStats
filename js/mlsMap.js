var circleRadius = 15;

var teamLocations = [
	{abbr: 'DCU', name: 'D.C. United', latitude: 38.8951, longitude: -77.0367, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'NYRB', name: 'New York Red Bulls', latitude: 40.6700, longitude: -73.9400, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'PHI', name: 'Philidelphia Union', latitude: 39.9500, longitude: -75.1700, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'CLB', name: 'Columbus Crew', latitude: 39.9833, longitude: -82.9833, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'SKC', name: 'Sporting Kansas City', latitude: 39.0997, longitude: -94.5786, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'CHI', name: 'Chicago Fire', latitude: 41.8819, longitude: -87.6278, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'TFC', name: 'Toronto FC', latitude: 43.7000, longitude: -79.4000, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'MTL', name: 'Montreal Impact', latitude: 45.5000, longitude: -73.5667, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'NE', name: 'New England Revolution', latitude: 42.3581, longitude: -71.0636, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'HOU', name: 'Houston Dynamo', latitude: 29.7628, longitude: -95.3831, radius: circleRadius, fillKey: 'gt500'}, 
	{abbr: 'FCD', name: 'FC Dallas', latitude: 32.7758, longitude: -96.7967, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'LAG/CHV', name: 'L.A. Galaxy/Chivas USA', latitude: 34.0500, longitude: -118.2500, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'SJ', name: 'San Jose Earthquakes', latitude: 37.3333, longitude: -121.9000, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'SEA', name: 'Seattle Sounders', latitude: 47.6097, longitude: -122.3331, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'POR', name: 'Portland Timbers', latitude: 45.5200, longitude: -122.6819, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'VAN', name: 'Vancouver Whitecaps', latitude: 49.2500, longitude: -123.1000, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'RSL', name: 'Real Salt Lake', latitude: 40.7500, longitude: -111.8833, radius: circleRadius, fillKey: 'gt500'},
	{abbr: 'COL', name: 'Colorado Rapids', latitude: 39.7392, longitude: -104.9847, radius: circleRadius, fillKey: 'gt500'}
];

var map = new Datamap({
	element: document.getElementById('map'),
	scope: 'world',
	setProjection: function(element) {
		var projection = d3.geo.equirectangular()
		  .center([-40, 10])
		  .rotate([4.4, 0])
		  .scale(800)
		  .translate([element.offsetWidth, element.offsetHeight]);
		var path = d3.geo.path()
		  .projection(projection);
		
		return {path: path, projection: projection};
	}
});

map.bubbles(teamLocations, {
	fillOpacity: 1.00,
	popupTemplate: function(geo, data) {
	  var imageHTML = "";
	  var imageFile = "";
	  if(data.abbr === "LAG/CHV") {
		imageHTML = "<div><img src='img/LAG.png' width='50px' height='50px' class='centerImage'><img src='img/CHV.png' width='50px' height='50px' class='centerImage'></div>"
	  } else {
	    imageFile = "img/" + data.abbr + ".png";
		imageHTML = "<img src='" + imageFile + "' width='50px' height='50px' class='centerImage'>";
	  }
	  return "<div class='hoverinfo'><div>" + data.name + "</div>" + imageHTML + "</div>";
	}
});

addEvents();

function addEvents(){
	var circles = d3.select("#map > svg").selectAll("circle")
	   .on("click", function(d) { clickCircle(d); });
};

function clickCircle(d) {
	console.log("CLICK: "+ d.name);

	$("#map svg").hide('slow', function() {
		$("#map").hide();
		buildBar();
		$('#barChart svg').show('slow', function() {});   	  		
	}); 
};