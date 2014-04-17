var teamLocations = [
	{name: 'DCU', latitude: 38.8951, longitude: -77.0367, radius: 20, fillKey: 'gt500'},
	{name: 'NYRB', latitude: 40.6700, longitude: -73.9400, radius: 20, fillKey: 'gt500'},
	{name: 'PHI', latitude: 39.9500, longitude: -75.1700, radius: 20, fillKey: 'gt500'},
	{name: 'CLB', latitude: 39.9833, longitude: -82.9833, radius: 20, fillKey: 'gt500'},
	{name: 'SKC', latitude: 39.0997, longitude: -94.5786, radius: 20, fillKey: 'gt500'},
	{name: 'CHI', latitude: 41.8819, longitude: -87.6278, radius: 20, fillKey: 'gt500'},
	{name: 'TFC', latitude: 43.7000, longitude: -79.4000, radius: 20, fillKey: 'gt500'},
	{name: 'MTL', latitude: 45.5000, longitude: -73.5667, radius: 20, fillKey: 'gt500'},
	{name: 'NE', latitude: 42.3581, longitude: -71.0636, radius: 20, fillKey: 'gt500'},
	{name: 'HOU', latitude: 29.7628, longitude: -95.3831, radius: 20, fillKey: 'gt500'}, 
	{name: 'FCD', latitude: 32.7758, longitude: -96.7967, radius: 20, fillKey: 'gt500'},
	{name: 'LAG/CHV', latitude: 34.0500, longitude: -118.2500, radius: 20, fillKey: 'gt500'},
	{name: 'SJ', latitude: 37.3333, longitude: -121.9000, radius: 20, fillKey: 'gt500'},
	{name: 'SEA', latitude: 47.6097, longitude: -122.3331, radius: 20, fillKey: 'gt500'},
	{name: 'POR', latitude: 45.5200, longitude: -122.6819, radius: 20, fillKey: 'gt500'},
	{name: 'VAN', latitude: 49.2500, longitude: -123.1000, radius: 20, fillKey: 'gt500'},
	{name: 'RSL', latitude: 40.7500, longitude: -111.8833, radius: 20, fillKey: 'gt500'},
	{name: 'COL', latitude: 39.7392, longitude: -104.9847, radius: 20, fillKey: 'gt500'}
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
	  return "<div class='hoverinfo'>" + data.name + "";
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