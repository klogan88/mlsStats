mlsStats
========

The application can be run by navigating to http://klogan88.github.io/mlsStats/ in a browser.  It is tested on FireFox,
Chrome, and Internet Explorer.  There are some known issues with the mapping library (DataMaps) I used in IE, so the presentation
is different than the others, but it is by no means unusable.

An application which allows the user to view some statistics on each team in Major League Soccer from the 2013 season.
The application uses JavaScript, jQuery, d3, HTML5, and CSS3.

The initial view is a map of North America which shows a bubble for each team in the league.  The bubbles are colored
blue for the Eastern Conference and orange for the Western Conference.  The user and mouse over on the bubble to see the team
name and crest.  When the user clicks on the bubble, the map fades and goes to a statistics view containing 2 bar charts and 
a list of results for each game in the regular season for the team.  The bar charts show goals scored and points earned by 
each team.  In addition, the bar chart higlights the bar for the currently selected team.  The user can click the Back button
to go back to the map view or click a bar in one of the bar charts to select another team.
