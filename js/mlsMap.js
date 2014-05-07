require({
		paths: {
			jquery: 'js/jquery',
			utils: 'js/mlsUtils'
		}
	},
	['jquery', 'utils'],
	function($, utils){
	
		//Stats view is initally hidden.
		$("#statsContainer").hide();

		//Radius for the circles on the map.
		var circleRadius = 15;

		//The team location data for placing the bubbles on the map.
		var teamLocations = [
			{abbr: 'DCU', name: 'D.C. United', latitude: 38.8951, longitude: -77.0367, radius: circleRadius, fillKey: 'east'},
			{abbr: 'NYRB', name: 'New York Red Bulls', latitude: 40.6700, longitude: -73.9400, radius: circleRadius, fillKey: 'east'},
			{abbr: 'PHI', name: 'Philadelphia Union', latitude: 39.9500, longitude: -75.1700, radius: circleRadius, fillKey: 'east'},
			{abbr: 'CLB', name: 'Columbus Crew', latitude: 39.9833, longitude: -82.9833, radius: circleRadius, fillKey: 'east'},
			{abbr: 'SKC', name: 'Sporting Kansas City', latitude: 39.0997, longitude: -94.5786, radius: circleRadius, fillKey: 'east'},
			{abbr: 'CHI', name: 'Chicago Fire', latitude: 41.8819, longitude: -87.6278, radius: circleRadius, fillKey: 'east'},
			{abbr: 'TFC', name: 'Toronto FC', latitude: 43.7000, longitude: -79.4000, radius: circleRadius, fillKey: 'east'},
			{abbr: 'MTL', name: 'Montreal Impact', latitude: 45.5000, longitude: -73.5667, radius: circleRadius, fillKey: 'east'},
			{abbr: 'NE', name: 'New England Revolution', latitude: 42.3581, longitude: -71.0636, radius: circleRadius, fillKey: 'east'},
			{abbr: 'HOU', name: 'Houston Dynamo', latitude: 29.7628, longitude: -95.3831, radius: circleRadius, fillKey: 'east'}, 
			{abbr: 'FCD', name: 'FC Dallas', latitude: 32.7758, longitude: -96.7967, radius: circleRadius, fillKey: 'west'},
			{abbr: 'LAG/CHV', name: 'Los Angeles Galaxy/Chivas USA', latitude: 34.0500, longitude: -118.2500, radius: circleRadius, fillKey: 'west'},
			{abbr: 'SJ', name: 'San Jose Earthquakes', latitude: 37.3333, longitude: -121.9000, radius: circleRadius, fillKey: 'west'},
			{abbr: 'SEA', name: 'Seattle Sounders FC', latitude: 47.6097, longitude: -122.3331, radius: circleRadius, fillKey: 'west'},
			{abbr: 'POR', name: 'Portland Timbers', latitude: 45.5200, longitude: -122.6819, radius: circleRadius, fillKey: 'west'},
			{abbr: 'VAN', name: 'Vancouver Whitecaps FC', latitude: 49.2500, longitude: -123.1000, radius: circleRadius, fillKey: 'west'},
			{abbr: 'RSL', name: 'Real Salt Lake', latitude: 40.7500, longitude: -111.8833, radius: circleRadius, fillKey: 'west'},
			{abbr: 'COL', name: 'Colorado Rapids', latitude: 39.7392, longitude: -104.9847, radius: circleRadius, fillKey: 'west'}
		];

		//Separated data for LA Galaxy and Chivas to use later since they are located in the same city/stadium.
		var chvLaData = [
			{abbr: 'LAG', name: 'Los Angeles Galaxy', fillKey: 'west'},
			{abbr: 'CHV', name: 'Chivas USA', fillKey: 'west'}
		];

		//Set up the datamap to be focuse on USA and Canada, the countries MLS is located in.
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
			},
			geographyConfig: {
				highlightOnHover: false,
				popupOnHover: false
			},
			fills: {
				defaultFill: "#ABDDA4",
				east: '#5FABED',
				west: '#EDA15F'
			},
		});

		//Populate the bubbles on the map.
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

		//Add click event for the back button when on the stats view.  Goes back to map view.
		$("#backBtn").click(function() {
			$("#statsContainer").fadeOut('slow', function() {
				d3.selectAll("#goalBarChart svg").remove();
				d3.selectAll("#ptsBarChart svg").remove();
				d3.selectAll("#seasonTable table").remove();
				$("#mapContainer").fadeIn('slow');
				$("#map svg").fadeIn('slow');
			});
		});

		//Add click event for Okay button to selecte LA or Chivas when selected.
		$("#okBtn").click(function() {
			if($("#lagRadio").prop("checked") === true) {
				openStats(chvLaData[0]);
			} else {
				openStats(chvLaData[1]);
			}
			
			$("#selectorDialog").fadeOut();
			$("#overlay").fadeOut();
		});

		//Add click event for cancel button to pick neither LA or Chivas and return to map.
		$("#cancelBtn").click(function() {
			$("#selectorDialog").fadeOut();
			$("#overlay").fadeOut();
		});

		//Add the events to the circles so that they are clickable on the map.
		addEvents();

		//Implement click events on the bubbles.
		function addEvents(){
			var circles = d3.select("#map > svg").selectAll("circle")
			   .on("click", function(d) { clickCircle(d); });
		};

		//Depending on circle clicked, either open LAG/CHV dialog or stats view.
		function clickCircle(d) {

			if(d.abbr === "LAG/CHV") {
				openDialog();		
			} else {
				openStats(d); 
			}
		};

		//Opens stats view and hides map view.
		function openStats(d) {
			$("#mapContainer").fadeOut('slow', function() {
				$("#teamLabel").text(d.name);
				utils.buildBar("#goalBarChart", "mlsStats.tsv", d.abbr, "Goals", "Team");
				utils.buildBar("#ptsBarChart", "mlsPts.tsv", d.abbr, "Points", "Team");
				utils.buildSeasonTable(d);
				$("#statsContainer").fadeIn('slow');
			}); 
		};

		//Open the dialog to select either LA or Chivas.
		function openDialog() {
			var body = $(window),
				bodyWidth = body.width(),
				bodyHeight = body.height(),
				selector = $("#selectorDialog"),
				dialogWidth = selector.width(),
				dialogHeight = selector.height(),
				left = (bodyWidth - dialogWidth)/2,
				top = (bodyHeight - dialogHeight)/2;
				
			selector.css('left', left).css('top', top).fadeIn();
			$("#overlay").fadeIn();
		};
	
});