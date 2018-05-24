var representationLabels = ["Gnonwhite","Gwomen","Gwomennonwhite","Tnonwhite","Twomen","Twomennonwhite","Lnonwhite","Lwomen","Lwomennonwhite"];
var categories = ["Global", "Technical", "Leadership"];
var statut = ["Nonwhite", "Women", "Nonwhitewomen"];
var colorStatus = d3.scaleOrdinal().range(['#D9D1E6','#CFE1F5','#C07BA0']).domain(statut);
var colorSectors = d3.scaleOrdinal().range(['#ffff4d','pink','lightgreen','#00cccc','black']).domain("ecommerce","analytics","healthcare","marketing","productivity");
var colorRace = d3.scaleOrdinal().range(['#bcbec0','#a3301b','#282e6a','#006838','#fbb040']).domain("white","asian","black","latix","others");
var colorGender = d3.scaleOrdinal().range(['#bcbec0','#CFE1F5','#d1d3d4']).domain("men","women","unknown");
var RaceGender = ["white","asian","black","latix","others","men","women"];

var mainScatterProps = {
	height: 430,
	width: 450,
	margin: {top: 20, bottom:20, left:75, right:25}
};

var smallScatterProps = {
	height: 190,
	width: 190,
	margin: {top: 20, bottom:20, left:30, right:30}
};

var animatedRepartition = {
	height: 200,
	width: 500,
	margin: {top: 100, bottom:20, left:80, right:20}
};

var barRepartition = {
	height: 60,
	width: 300,
	margin: {top: 10, bottom:10, left:10, right:10}
};

var scatters = [
	{id: "#scatterGlobal", svgProps: mainScatterProps, sector: 0, axes: "axes"},
	{id: "#scatterTest", svgProps: smallScatterProps, sector: "ecommerce", axes: 0},
	{id: "#scatterTest2", svgProps: smallScatterProps, sector: "healthcare", axes: 0},
	{id: "#scatterTest3", svgProps: smallScatterProps, sector: "analytics", axes: 0},
	{id: "#scatterTest4", svgProps: smallScatterProps, sector: "marketing", axes: 0},
	{id: "#scatterTest5", svgProps: smallScatterProps, sector: "productivity", axes: 0}
];

/// TOOLTIP ///
// Add a div that will go wherever in the body 
var tooltipScatter = d3.select("body").append("div")
	.attr("class", "tooltipScatter");
tooltipScatter.style("opacity", 0);

var tooltipRepresentation = d3.select("body").append("div")
	.attr("class", "tooltipRepresentation");
tooltipRepresentation.style("opacity", 0);

var tooltipBar = d3.select("body").append("div")
	.attr("class", "tooltipRepresentation");
tooltipBar.style("opacity", 0);
