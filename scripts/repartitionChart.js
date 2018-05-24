baseHeight = 100;
baseWidth = 250;
baseMargin = {top: 75, bottom:25, left:10, right:10};

function drawCharts(div,data) {

	var divs = div.selectAll(".chart")
		.data(data)
		.enter()
		.append("div")
		//.attr("class","chart");
			.attr("class", (d,i) => {
				// Custom class for Isotope filtering		
				 var aclass = "chart";
				 if (d.representation_array[8].perc == 0){ aclass = aclass + " nowomencolorleadership"; }
				 if (d.representation_array[7].perc == 0){ aclass = aclass + " nowomenleadership"; }
				 if ( (d.representation_array[8].perc > d.representation_array[2].perc) || (d.representation_array[5].perc > d.representation_array[2].perc)){ aclass = aclass + " morewomencolor" ;}
				 return aclass;
				 
			});
	
	var svg = divs.append("svg")
	  		//.attr("id", (d,i) => "id" + i)
	  		.attr("class", "chartRepresentation")
	  		.attr("width", baseWidth + baseMargin.left + baseMargin.right )
	  		.attr("height", baseHeight + baseMargin.top + baseMargin.bottom )
	  		.append("g")
	  			.attr("id", (d,i) => "id" + i)
				.attr("transform", "translate(" + baseMargin.left + "," + baseMargin.top + ")");
	
	// Add company basic info
	var companyInfo = [
		{data: "company", beforeText: "", afterText: "", aclass: "chartCompany hXtooltip", transform: "(0,-60)"},
		{data: "total_employees", beforeText: "", afterText: " employees", aclass: "chartEmployees", transform: "(0,-25)"}
		//{data: "sector", beforeText: "", afterText: " | ", aclass: "chartSector", transform: "(0,-10)"},
		//{data: "customer_base", beforeText: "", afterText: "", aclass: "chartSector", transform: "(50,-10)"}
	];
	
	for (i=0;i<companyInfo.length;i++) {
		
		svg.append("text")
			.text( (d) => {return companyInfo[i].beforeText + d[companyInfo[i].data] + companyInfo[i].afterText})
			.attr("class", companyInfo[i].aclass)
			.attr("transform", "translate" + companyInfo[i].transform);
	}
	// Sector | Customer base nicely put
	svg.append("text")
		.text( (d) => {return d.sector + " | " + d.customer_base})
		.attr("class", "chartSector")
		.attr("transform", "translate(0,-10)");
		
	// Ranking	
	svg.append("text")
		.text( (d) => {return "#" + d.rank + " | tech #" + d.tech_rank + " | leadership #" + d.leadership_rank})
		.attr("class", "chartRank")
		.attr("transform", "translate(0,-40)");
	
	// Draw Representation chart for each
	for (j=0;j<data.length;j++){
		//console.log(j);
		//console.log(data[j].representation_array);
	  	drawRepartitionChart(d3.select("#id"+j),0,data[j].representation_array,0,0);
	}	
}

function redrawRepartitionChartAnimated(svg,svgProps){
	
	var stdDelay = 2000;
	var stdDuration = 2000;
	var longerDelay = 10000;
	var delays = [stdDelay,stdDelay,stdDelay,longerDelay,stdDelay,stdDelay,longerDelay,stdDelay,stdDelay];
	var appliedDelays = [stdDelay];
	
	for (i=1;i<delays.length;i++) {
		appliedDelays.push( appliedDelays[i-1] + delays[i] );
	}
	console.log(appliedDelays);

	var height, width, margin ;
	if (svgProps == 0){
		height = baseHeight;
		width = baseWidth;
		margin = baseMargin;
	}
	else {
		height = svgProps.height;
		width = svgProps.width;
		margin = svgProps.margin;
	}
	
	var padChart = {
		middle: width/2,
		rectHeight: height/5,
		paddingInit: 10,
		paddingBetween: 10,
	};
	
	// AXIS
	var x = d3.scaleLinear()
		.range([0, padChart.middle])
		.domain([0,0.8]);
		
	//set Rectangle width to 0
	svg.selectAll("rect")
		.transition()
		.attr("width", 0)	;
	
	//draw with animation
	svg.selectAll("rect")
		.transition()
			.delay( (d,i) => { 
				//var thisDelay = otherI(i) * delays[otherI(i)-1];
				//console.log("d.type: " + d.type + " , i: " + i + ", otherI: " + otherI(i) + ", thisDelay: " + thisDelay);
				return (appliedDelays[otherI(i)-1])/*2000*/; 
			})
			.duration(stdDuration)
			.attr("width", (d,i) => x(d.perc) )	;
	
	// animated explanation 
	var middle = padChart.middle + margin.left;
	var yset1 = 40;
	var yset2 = 60;
	
	//text
	var explanation = [
		{ delay: appliedDelays[2] + stdDuration, text: 'Non white people are a bit more represented in tech', x: middle, y: yset1, aclass: "scatterAxisLegend", anchor: "middle"},
		{ delay: appliedDelays[2] + stdDuration, text: 'but a lot less in leadership than overall', x: middle, y: yset2, aclass: "scatterAxisLegend", anchor: "middle"},
		{ delay: appliedDelays[5] + stdDuration, text: 'On average, women are less represented than real life !', x: middle, y: yset1, aclass: "scatterAxisLegend", anchor: "middle"},
		{ delay: appliedDelays[5] + stdDuration, text: 'and going to tech and leadership team, we loose almost half ...', x: middle, y: yset2, aclass: "scatterAxisLegend", anchor: "middle"},
		{ delay: appliedDelays[8] + stdDuration, text: 'Women of color - intersection of non white people and women', x: middle, y: yset1, aclass: "scatterAxisLegend", anchor: "middle"},
		{ delay: appliedDelays[8] + stdDuration, text: 'decrease from overall to tech to leadership', x: middle, y: yset2, aclass: "scatterAxisLegend", anchor: "middle"}
	];
		
	svg.append("g").selectAll("text")
		.data(explanation) 
		.enter()
		.append("text")
			.text((d) => d.text)
			.style('text-anchor', (d) => d.anchor)
			.style('opacity', 0)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("class", (d) =>  "textLegend " + d.aclass)
			.transition()
				.delay( (d,i) => d.delay - 500)
				.duration(2000)
				.style('opacity', 1)
				.transition() // Chained transition not start/end
					.delay( (d,i) => 5000)
					.duration(1000)
					.style('opacity', 0);
	//lines
	console.log("lines"+ yPositionCategory(padChart,"Gnonwhite"));
	
	var explanationLines = [
		{ delay: appliedDelays[2] + stdDuration, x1: padChart.middle - x(0.4), x2: padChart.middle - x(0.45), y1: yPositionCategory(padChart,"Gnonwhite") + padChart.rectHeight/2, y2: yPositionCategory(padChart,"Tnonwhite") + padChart.rectHeight/2},
		{ delay: appliedDelays[2] + stdDuration, x1: padChart.middle - x(0.45), x2: padChart.middle - x(0.26), y1: yPositionCategory(padChart,"Tnonwhite") + padChart.rectHeight/2, y2: yPositionCategory(padChart,"Lnonwhite") + padChart.rectHeight/2},      
		{ delay: appliedDelays[5] + stdDuration, x1: padChart.middle + x(0.39), x2: padChart.middle + x(0.23), y1: yPositionCategory(padChart,"Gwomen") + padChart.rectHeight/2, y2: yPositionCategory(padChart,"Lwomen") + padChart.rectHeight/2},
		{ delay: appliedDelays[8] + stdDuration, x1: padChart.middle - x(0.1), x2: padChart.middle - x(0.04), y1: yPositionCategory(padChart,"Gwomennonwhite") + padChart.rectHeight/2, y2: yPositionCategory(padChart,"Lwomennonwhite") + padChart.rectHeight/2},   
		{ delay: appliedDelays[8] + stdDuration, x1: padChart.middle + x(0.1), x2: padChart.middle + x(0.04), y1: yPositionCategory(padChart,"Gwomennonwhite") + padChart.rectHeight/2, y2: yPositionCategory(padChart,"Lwomennonwhite") + padChart.rectHeight/2}
	];
	
	svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.selectAll(".explanationLines")
		.data(explanationLines)
		.enter()
		.append("line")
		.attr("class","explanationLines")
		.style("stroke", "grey")
		.style("stroke-width", 3)
		.attr("x1", (d,i) => d.x1)     
		.attr("y1",  (d,i) => d.y1)      
		.attr("x2",  (d,i) => d.x2)     
		.attr("y2",  (d,i) => d.y2)
		.style('opacity', 0)
		.transition()
			.delay( (d,i) => d.delay - 500)
			.duration(2000)
			.style('opacity', 1)
			.transition() // Chained transition not start/end
				.delay( (d,i) => 5000)
				.duration(1000)
				.style('opacity', 0);
}

function drawRepartitionChart(svg,svgProps,data,ifLegend,animated){

	var height, width, margin ;
	if (svgProps == 0){
		height = baseHeight;
		width = baseWidth;
		margin = baseMargin;
	}
	else {
		height = svgProps.height;
		width = svgProps.width;
		margin = svgProps.margin;
	}
	
	var padChart = {
		middle: width/2,
		rectHeight: height/5,
		paddingInit: 10,
		paddingBetween: 10,
	};
	
	// AXIS
	var x = d3.scaleLinear()
		.range([0, padChart.middle])
		.domain([0,0.8]);
	
	var linesData = [
		//{x1: padChart.middle - x(0.6), x2: padChart.middle - x(0.6), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		//{x1: middle - x(0.5), x2: middle - x(0.5), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		//{x1: padChart.middle - x(0.4), x2: padChart.middle - x(0.4), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		//{x1: middle - x(0.3), x2: middle - x(0.3), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		//{x1: padChart.middle - x(0.2), x2: padChart.middle - x(0.2), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		//{x1: middle - x(0.1), x2: middle - x(0.1), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		{x1: padChart.middle, x2: padChart.middle, y1: 0, y2: height-6, color:"grey", dasharray: 0},
		//{x1: padChart.middle + x(0.6), x2: padChart.middle + x(0.6), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		//{x1: middle + x(0.5), x2: middle + x(0.5), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		//{x1: padChart.middle + x(0.4), x2: padChart.middle + x(0.4), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		//{x1: middle + x(0.3), x2: middle + x(0.3), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		//{x1: padChart.middle + x(0.2), x2: padChart.middle + x(0.2), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		//{x1: middle + x(0.1), x2: middle + x(0.1), y1: 0, y2: height, color:"lightgrey", dasharray: 3}
	];
	
	var white_dash = 2;
	
	var linesDataWhite = [
		{x1: padChart.middle - x(0.5), x2: padChart.middle - x(0.5), y1: 0, y2: height, color:"white", dasharray: white_dash},
		//{x1: middle - x(0.5), x2: middle - x(0.5), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		{x1: padChart.middle - x(0.75), x2: padChart.middle - x(0.75), y1: 0, y2: height, color:"white", dasharray: white_dash},
		//{x1: middle - x(0.3), x2: middle - x(0.3), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		{x1: padChart.middle - x(0.25), x2: padChart.middle - x(0.25), y1: 0, y2: height, color:"white", dasharray: white_dash},
		//{x1: middle - x(0.1), x2: middle - x(0.1), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		//{x1: padChart.middle, x2: padChart.middle, y1: 0, y2: height, color:"grey", dasharray: 0},
		{x1: padChart.middle + x(0.5), x2: padChart.middle + x(0.5), y1: 0, y2: height, color:"white", dasharray: white_dash},
		//{x1: middle + x(0.5), x2: middle + x(0.5), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		{x1: padChart.middle + x(0.75), x2: padChart.middle + x(0.75), y1: 0, y2: height, color:"white", dasharray: white_dash},
		//{x1: middle + x(0.3), x2: middle + x(0.3), y1: 0, y2: height, color:"lightgrey", dasharray: 3},
		{x1: padChart.middle + x(0.25), x2: padChart.middle + x(0.25), y1: 0, y2: height, color:"white", dasharray: white_dash},
		//{x1: middle + x(0.1), x2: middle + x(0.1), y1: 0, y2: height, color:"lightgrey", dasharray: 3}
	];
	
	var percDataWhite = [
		{x: padChart.middle - x(0.5), perc: "50%"},
		{x: padChart.middle - x(0.75), perc: "75%"},
		{x: padChart.middle - x(0.25), perc: "25%"},
		{x: padChart.middle + x(0.5), perc: "50%"},
		{x: padChart.middle + x(0.75), perc: "75%"},
		{x: padChart.middle + x(0.25), perc: "25%"},
	];
		
	//DRAW BACKGROUND LINES
	// GREY
	svg.append("g")
		.attr("class","tickLegend")
		.selectAll(".ticks")
			.data(linesData)
			.enter()
			.append("line")
			.attr("class","ticks")
			.style("stroke", (d,i) => d.color)
			.style("stroke-dasharray", (d,i) => (d.dasharray+", "+d.dasharray) )  // <== This line here!!
			.attr("x1", (d,i) => d.x1)     
			.attr("y1",  (d,i) => d.y1)      
			.attr("x2",  (d,i) => d.x2)     
			.attr("y2",  (d,i) => d.y2); 

	// DRAW RECTANGLES
	svg.append("g")
		.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", (d,i) => whatStatus(i) )
			.attr("x", (d,i) => xPosition(d,i,padChart,x) )
			.attr("y", (d,i) => yPositionCategory(padChart,d.type) )
			//.attr("width", (d,i) => x(d.perc) )
			.attr("width", (d,i) => {
				if (animated) { return 0; }
				else { return x(d.perc); }
			})
			.attr("height", padChart.rectHeight)
			.style("fill", (d,i) => {return colorStatus(whatStatus(i));})
			.style("fill-opacity", 1)
			//Only for left rectangle i.e. non white people, do the rotation, to enable the explaining transition to start from 0 to value width
			.attr("transform", (d,i) => {
				var xset = 0;
				var yset = 0;
				var rotation = 0;
				//console.log(whatStatus(i));
				if (whatStatus(i) == "Nonwhite") {
					xset = xPosition(d,i,padChart,x) + x(d.perc)/2 ;
					yset = yPositionCategory(padChart,d.type) + padChart.rectHeight/2;
					rotation = 180;
				}
				return "rotate(" + rotation + "," + xset + "," + yset  + ")";
			})
			.on("mouseover", (d,i) => { 
				d3.select(d3.event.target)
					.style("stroke-width",5);
				showTipRepresentation(d);
			})
			.on("mouseout", (d,i) => {
				d3.select(d3.event.target)
					.style("stroke-width",0);
				hideTipRepresentation();
			});
			
	if (animated) {
		svg.selectAll("rect")
				.transition()
					.delay( (d,i) => { return (otherI(i)) * 2000; })
					.duration(2000)
					.attr("width", (d,i) => x(d.perc) )	;
	}
	
	//DRAW FRONT LINES
	// WHITE
	
	svg.append("g")
		.attr("class","tickLegend")
		.selectAll(".ticks")
			.data(linesDataWhite)
			.enter()
			.append("line")
			.attr("class","ticks")
			.style("stroke", (d,i) => d.color)
			.style("stroke-dasharray", (d,i) => (d.dasharray+", "+d.dasharray) )  // <== This line here!!
			.attr("stroke-width",1.5)  
			.attr("x1", (d,i) => d.x1)     
			.attr("y1",  (d,i) => d.y1)      
			.attr("x2",  (d,i) => d.x2)     
			.attr("y2",  (d,i) => d.y2); 

	// ----------	
	// LEGEND
	// ----------	
	if(ifLegend){
	
	//DRAW PERC
	svg.append("g")
		.selectAll(".percLegend")
			.data(percDataWhite)
			.enter()
			.append("text")
			.attr("class","percLegend")
			.attr("x", (d,i) => d.x)     
			.attr("y",  height + 5) 
			.text((d,i) => d.perc)
			.style('text-anchor','middle');    
	
	//and 0
	svg.append("g")
		.append("text")
		.attr("class","percLegend")
		.attr("x", padChart.middle)     
		.attr("y",  height + 5) 
		.text("0")
		.style('text-anchor','middle');  
		/*
		// ARROW MARKERS
		var arrowMarkers = [
			{ id: 0, name: 'arrowRight', orient: 0 },
			{ id: 1, name: 'arrowLeft', orient: 180}
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
		    .attr("fill", "grey");
		    
		// ARROW DEFINITION
		var arrowLenght = 80;
		var paddingTop = -8;
		var paddingZero = 8;
		var arrowLegend = [
			{x1: padChart.middle - paddingZero, x2: padChart.middle - arrowLenght, y1: paddingTop, y2: paddingTop, start: '', end: 'url(#arrowLeft)'},
			{x1: padChart.middle + paddingZero, x2: padChart.middle + arrowLenght, y1: paddingTop, y2: paddingTop, start: '', end: 'url(#arrowRight)'},
			{x1: padChart.middle - arrowLenght/4, x2: padChart.middle + arrowLenght/4, y1: -20, y2:-20, start: 'url(#arrowLeft)', end: 'url(#arrowRight)'}	
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
		*/
		// TEXT
		// CATEGORIE
		svg.append("g").attr("class","textCategoryLegend")
			.selectAll('.categoryLegend')
			.data(categories)
			.enter()
			.append('text')
			.attr("class","categoryLegend")
				.attr("x",30)
				.attr("y", (d,i) => yPositionCategory(padChart,d) + padChart.rectHeight/2 + 5)
				.text((d,i) => d)
				.style('text-anchor','end');		
	}
	else {
		//DRAW RECTANGLE DELIMITER
		svg.append("g")
			.attr("class","recDelimiter")
			.append("rect")
			.attr("x", 0)
			.attr("y", height + 15)
			.attr("width", width)
			.attr("height", 3)
			.style("fill", "#e6e6e6")
	
	}
}

function xPosition(d,i,padChart,x) {
	var xposition;
	switch(whatStatus(i)) {
		//Nonwhite
		case statut[0]:
			xposition = padChart.middle - x(d.perc);
			//xposition = padChart.middle;
			break;
		//women
		case statut[1]:
			xposition = padChart.middle;
			break;
		//women nonwhite
		case statut[2]:
			xposition = padChart.middle - x(d.perc)/2;
			break;
	}
	return xposition;
}

function yPositionCategory(padChart,type){

	var yposition;
		switch(whatCategory(type)) {
			//Cat 1 Global
			case categories[0]:
				yposition = padChart.paddingInit;
				break;
			//Cat 2 Tech
			case categories[1]:
				yposition = padChart.paddingInit + padChart.rectHeight + padChart.paddingBetween;
				break;
			//Cat 3 Leadership
			case categories[2]:
				yposition = padChart.paddingInit + 2*(padChart.rectHeight + padChart.paddingBetween);
				break;
		}
	return yposition;
}

//return categories from representation labels
function whatCategory(label){
	var result ;
	if (label.startsWith("G")){ result = categories[0];}
	else if (label.startsWith("T")){ result = categories[1];}
	else if (label.startsWith("L")){ result = categories[2];}
	return result;
}

function whatStatus(i){
	var result ;
	if ((i)%3 == 0){ 
		result = statut[0];
	}
	else if ((i)%3 == 1){ result = statut[1];}
	else if ((i)%3 ==2){ result = statut[2];}
	return result;
}

// Do it again with real function ?
// Give the other i to iterate through the data by statut, not by category
function otherI(i){
	var otheri = i+1;
	switch(i+1) {
		case 2:
			otheri = 4;	
			break;
		case 3:
			otheri = 7;
			break;
		case 4:
			otheri = 2;
			break;
		case 6:
			otheri = 8;
			break;
		case 7:
			otheri = 3;
			break;
		case 8:
			otheri = 6;
			break;
	}
	//console.log("i+1: "+(i+1) +", otheri = "+ otheri);
	return otheri;
}

// highlightTab : associated to status tab with 1/0 to know which to highligth
// var statut = ["Nonwhite", "Women", "Nonwhitewomen"];
// either one of them at 1 or all to go back to normal
function highlightRepartition(/*svg,*/highlightTab) {
	var backlightColor = "#e6e6e6";
	
	// for each status
	for(i=0;i<statut.length;i++){
		// backlight if 0
		if (highlightTab[i] == 0){
			d3.selectAll("."+statut[i])
			.transition()
			.duration(2000)
				.style("opacity",0.3)
				.style("fill",backlightColor);
		}
		// original color if highlight = 1
		else {
			d3.selectAll("."+statut[i])
			.transition()
			.duration(2000)
				.style("opacity",1)
				.style("fill",colorStatus(statut[i]));
		}
	}
	
	//then backlight the need ones if needed
	//svg.selectAll(".Women").style("fill",backlightColor);

}

function showTipRepresentation(d) {

	tooltipRepresentation.html(niceRepresentationLabel(d.type) + " : <b>" + d3.format('.1%')(d.perc)+ "</b>")
		// On utilise style pour définir l'endroit d'affichage
		.style("left", (d3.event.pageX + 10) + "px")
		.style("top", (d3.event.pageY - 20) + "px");
		
	tooltipRepresentation.transition()
   		.duration(500)
   		.style("opacity", .9);

}

function hideTipRepresentation() {
	tooltipRepresentation.transition()
		.duration(500)
		.style("opacity", 0);
}
//var representationLabels = ["Gnonwhite","Gwomen","Gwomennonwhite","Tnonwhite","Twomen","Twomennonwhite","Lnonwhite","Lwomen","Lwomennonwhite"];
function niceRepresentationLabel(label){
	var niceLabel ;
	switch(label) {
		case representationLabels[0]:
			niceLabel = "Global | Non white"; 
			break;
		case representationLabels[1]:
			niceLabel = "Global | Women"; 
			break;
		case representationLabels[2]:
			niceLabel = "Global | Non white Women"; 
			break;
		case representationLabels[3]:
			niceLabel = "Technical | Non white"; 
			break;
		case representationLabels[4]:
			niceLabel = "Technical | Women"; 
			break;
		case representationLabels[5]:
			niceLabel = "Technical | Non white Women"; 
			break;
		case representationLabels[6]:
			niceLabel = "Leadership | Non white"; 
			break;
		case representationLabels[7]:
			niceLabel = "Leadership | Women"; 
			break;
		case representationLabels[8]:
			niceLabel = "Leadership | Non white Women"; 
			break;
	}
	return niceLabel;
}
