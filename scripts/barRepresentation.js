

function drawBarRepresentation(svgId, svgProps, data, type) {

	var svg = svgSetUp(svgId,svgProps);
	
	var rectHeight = 30;
	// AXIS
	var xScaleBar = d3.scaleLinear()
		.range([0, svgProps.width])
		.domain([0,1]);
	
	svg.append("g")
		.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			//.attr("class", (d,i) => whatStatus(i) )
			.attr("x", (d,i) => xScaleBar(d.relativePerc) )
			.attr("y", svgProps.height/2 - rectHeight/2)
			.attr("width", (d,i) => xScaleBar(d.perc) )
			.attr("height", rectHeight)
			.style("fill", (d,i) => {
				if (type == "race"){
					return colorRace(d.type);
				}
				else if (type == "gender"){
					return colorGender(d.type);
				}
			})
			.on("mouseover", (d,i) => { 
				d3.select(d3.event.target).style("stroke-width",5);
				showTipBar(d);
			})
			.on("mouseout", (d,i) => {
				d3.select(d3.event.target).style("stroke-width",0);
				hideTipBar();
			});
}

function showTipBar(d) {

	tooltipBar.html(d.type + " : <b>" + d3.format('.1%')(d.perc)+ "</b>")
		// On utilise style pour définir l'endroit d'affichage
		.style("left", (d3.event.pageX + 10) + "px")
		.style("top", (d3.event.pageY - 20) + "px");
		
	tooltipBar.transition()
   		.duration(500)
   		.style("opacity", .9);

}

function hideTipBar() {
	tooltipBar.transition()
		.duration(500)
		.style("opacity", 0);
}
