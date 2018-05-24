var max_x = 3200;
var max_y = 108;
var max_r = 3200;

function drawScatter(svgId, svgProps, data, xVar, yVar, rVar, highlight, colorFunction, ifAxes) {

	var svg = svgSetUp(svgId,svgProps);
	var x_ticks = svgProps.width / 120;
	var y_ticks = svgProps.height / 80;
	var strokeWdith = svgProps.height / 100 ;
	
	/// SCALES ///
	var xScale = d3.scaleLinear()
		.domain([0,max_x])
		.range([0, svgProps.width]);
	
	var yScale = d3.scaleLinear()
		.domain([1,max_y])
		.range([0, svgProps.height]);

	if ( ifAxes != 0 ){
		var yAxis = d3.axisLeft(yScale);
		svg.append("g")
			.attr("class", "axisGrey")
			.call(yAxis.ticks(y_ticks));
			
		var xAxis = d3.axisBottom(xScale);
		svg.append("g")
			// move it ot the bottom
			.attr("transform", "translate(" + 0 + "," + svgProps.height + ")")
			.attr("class", "axisGrey")
			.call(xAxis.ticks(x_ticks));
	}
	
	var rScale = d3.scaleSqrt()
		.domain([0, max_r])
		.range([0, svgProps.height/20]);
		
	svg.append("rect")
		.attr("x",1)
		.attr("y",-10)
		.attr("width", svgProps.width + 25)
		.attr("height", svgProps.height + 10)
		.style("fill", '#f2f2f2');
	
	/// SECTOR LEGEND IF ANY ///
	if (highlight) {
		svg.append("rect")
			.attr("x",svgProps.width - 70)
			.attr("y",svgProps.height)
			.attr("width", 90)
			.attr("height", 3)
			.style("fill", colorFunction(highlight));
			
		svg.append("text")
			.text(highlight)
			.attr("x",svgProps.width - 70)
			.attr("y",svgProps.height - 10 + 15/2)
			.attr("class", "sectorLegend");
	}
	
		
	/// DATA ///
	var selection = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", 
			(d,i) => {return xScale(d[xVar]);})
		.attr("cy", 
			(d,i) => {return yScale(d[yVar]);})
		.attr("r",
			(d,i) => {return rScale(d[rVar]);})
		.style("opacity",0.7)
		.style("fill",
			(d,i) => {
				if (highlight == 0){
					return "darkgrey";
				}
				else if (highlight == d.sector) {
					return colorFunction(d.sector);
				}
				else {
					return "#d9d9d9";
				}
			})
		.on("mouseover", (d,i) => { 
			//console.log(d3.select(d3.event.target));
			//d3.event.target return the DOM element
			// .style function can be used on a d3 selection > d3.select
			//d3.select(d3.event.target).style("fill", "blue");
			d3.select(d3.event.target)
				.style("opacity", 1)
				.style("stroke","white")
				.style("stroke-width",rScale(d[rVar])/5);
			showTipScatter(d);
		})
		.on("mouseout", (d,i) => {
			d3.select(d3.event.target)
				.style("opacity", 0.7)
				.style("stroke-width",0);
			hideTipScatter();
		});
		
		//AXES LEGEND
		if ( ifAxes != 0 ){

			var textLegend = [
				{ text: 'larger company', x: svgProps.width - 130, y: svgProps.height - 10, aclass: "scatterAxisLegend", anchor: "start"},
				{ text: "diverse", x: -20, y: 45, aclass: "scatterAxisLegend", anchor: "end"},
				{ text: "more", x: -20, y: 30, aclass: "scatterAxisLegend", anchor: "end"},
				{ text: "diverse", x: -20, y: svgProps.height-30, aclass: "scatterAxisLegend", anchor: "end"},
				{ text: "less", x: -20, y: svgProps.height-45, aclass: "scatterAxisLegend", anchor: "end"}
			];

			svg.append("g").selectAll("text")
				.data(textLegend) 
				.enter()
				.append("text")
					.text((d) => d.text)
					.style('text-anchor', (d) => d.anchor)
					.attr("x", (d) => d.x)
					.attr("y", (d) => d.y)
					.attr("class", (d) =>  "textLegend " + d.aclass);
			
			// MORE LESS DIVERSE
			/*
			svg.append("text")
				.text("diverse")
				.attr("x",-10)
				.attr("y",0)
				.style('text-anchor','end')
				.attr("class", "scatterAxisLegend");
			*/
				
			// ARROW MARKERS
			var arrowMarkers = [
				{ id: 0, name: 'arrowRight', orient: 0 },
				{ id: 1, name: 'arrowLeft', orient: 180},
				{ id: 2, name: 'arrowBottom', orient: 90},
				{ id: 3, name: 'arrowTop', orient: 270}
			];
	
			svg.append("svg:defs").selectAll("marker")
				.data(arrowMarkers)      // Different link/path types can be defined here
			  .enter()
			  .append("svg:marker")
				.attr("id", (d,i) => d.name)    // This section adds in the arrows
				.attr("viewBox", "0 0 12 12")
				.attr("refX", 6)
				.attr("refY", 6)
				.attr("markerWidth", 6)
				.attr("markerHeight", 6)
				.attr("orient", (d,i) => d.orient)
			  .append("svg:path")
				.attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
				.attr("fill", "#404040");
				
			// ARROW DEFINITION
			var arrowLenght = 60;
			var paddingTop = -8;
			var paddingZero = 8;
			var arrowLegend = [
				{x1: svgProps.width - 80, x2: svgProps.width - 80 + arrowLenght, y1: svgProps.height - 30, y2: svgProps.height - 30, start: '', end: 'url(#arrowRight)'},
				{x1: -10, x2: -10, y1: 0 + arrowLenght, y2: 0 , start: '', end: 'url(#arrowTop)'},
				{x1: -10, x2: -10, y1: svgProps.height - arrowLenght , y2: svgProps.height - arrowLenght + arrowLenght , start: '', end: 'url(#arrowBottom)'}
			];
				
			svg.append("g").attr("class","arrowLegend")
				.selectAll(".ticks")
					.data(arrowLegend)
					.enter()
					.append("line")
					.attr("x1", (d,i) => d.x1)  
					.attr("y1", (d,i) => d.y1)  
					.attr("x2", (d,i) => d.x2)  
					.attr("y2", (d,i) => d.y2)  
					.attr("stroke","lightgrey")  
					.attr("stroke-width",2)  
					.attr('marker-start', (d,i) => d.start)
					.attr('marker-end', (d,i) => d.end);
		
		}
		
}
//rank = "rank" "tech_rank" "leadership_rank"
function switchTo(svg,svgProps,rank){

	var yScale = d3.scaleLinear()
		.domain([1,max_y])
		.range([0, svgProps.height]);
	
	svg.selectAll("circle")
		.transition()
		.duration(2000)
		.attr("cy", 
			(d,i) => {
				return yScale(d[rank]);
			});
}


function showTipScatter(d) {

	tooltipScatter.html(printCompany(d))
		// On utilise style pour définir l'endroit d'affichage
		.style("left", (d3.event.pageX + 10) + "px")
		.style("top", (d3.event.pageY - 20) + "px");
		
	tooltipScatter.transition()
   		.duration(500)
   		.style("opacity", .9);

}

function hideTipScatter() {
	tooltipScatter.transition()
		.duration(500)
		.style("opacity", 0);
}

function printCompany(v) {
	return "<h3 class='hXtooltip'>" + v.company + "</h3>"
		+ "<br/>" + "<b>#" + v.rank + "</b> on overall ranking"
		+ "<br/> | tech #" + v.tech_rank + " | leadership #" + v.leadership_rank + " | "
		+ "<br/><br/>" + v.total_employees + " employees"
		+ "<br/><br/>" + v.sector + " | " + v.customer_base;
}



