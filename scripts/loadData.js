
d3.csv("data/DTP_Data_050118.csv", function(data) {
	console.log(data);
	var prepData = prepareData(data);
	console.log(prepData);
	
	console.log(colorSectors("ecommerce"));
	console.log(colorSectors("analytics"));
	console.log(colorSectors("healthcare"));	
	console.log(colorSectors("marketing"));
	console.log(colorSectors("productivity"));

	
	setUpScatters(prepData);

	var svgAnimated = svgSetUp("#animated",animatedRepartition);
	drawRepartitionChart(svgAnimated,animatedRepartition,computeAverageCompany(prepData).representationArray,1,0);

	var multiple = d3.select(".chartContainer");
	drawCharts(multiple,prepData);
	
	setupBtn();
	
	setUpBars(prepData);

	setupIsotope();
	
});

function setUpBars(data) {

	var americaBardataRace = [
		{type: "white", perc: 0.68},
		{type: "asian", perc: 0.05},
		{type: "black", perc: 0.12},
		{type: "latix", perc: 0.16},
		{type: "others", perc: 0}
	];

	computeOverallPercentageBar(americaBardataRace);
	
	var americaBardataGender = [
		{type: "men", perc: 0.5},
		{type: "women", perc: 0.5}
	];
	
	computeOverallPercentageBar(americaBardataGender);

	var averageBardata = computeAverageCompany(data).baseDTPdata;
	
	drawBarRepresentation("#barrepresentationRace1", barRepartition, americaBardataRace, "race");
	drawBarRepresentation("#barrepresentationGender1", barRepartition, americaBardataGender, "gender");
	drawBarRepresentation("#barrepresentationRace2", barRepartition, computeOverallPercentageBar(averageBardata.slice(0,5)), "race");
	drawBarRepresentation("#barrepresentationGender2", barRepartition, computeOverallPercentageBar(averageBardata.slice(5,7)), "gender");


}

function setUpScatters(data){
	for(k=0;k<scatters.length;k++){
		drawScatter(scatters[k].id, scatters[k].svgProps, data, "total_employees", "rank", "total_employees", scatters[k].sector, colorSectors, scatters[k].axes);
	}
}

function computeOverallPercentageBar(testBardata){
	var sum = 0;
	for (i=0;i<testBardata.length;i++){	
		testBardata[i].relativePerc = sum;
		sum += testBardata[i].perc;
	}
	return testBardata;
}

function computeAverageCompany(data){
// Average representationArray
// Average baseDTPdata

	var representationArray = [];
	var baseDTPdata = [];
	var sumRepresentationArray;
	var sumDTPdata;

	//for each category		
	for (i=0;i<representationLabels.length;i++){
		sumRepresentationArray = 0;
		sumDTPdata = 0;

		//compute the average
		for (j=0;j<data.length;j++){
			sumRepresentationArray += data[j].representation_array[i].perc ;
			
			//Same loop for overall Race & Gender data
			if (i < RaceGender.length ){
				sumDTPdata += data[j].baseDTPdata[i].perc ;
			}
		}

		representationArray.push(
			{type: representationLabels[i], 
			perc: sumRepresentationArray/data.length}
		);
		
		
		baseDTPdata.push(
			{type: RaceGender[i], 
			perc: sumDTPdata/data.length}
		);
				
	}
	//console.log(representationArray);
	return {representationArray: representationArray, baseDTPdata: baseDTPdata } ;
}

function setupBtn() {
	d3.select("#btn-highlight-nonwhite").on("click", (d) => highlightRepartition([1,0,0]) );
	d3.select("#btn-highlight-women").on("click", (d) => highlightRepartition([0,1,0]) );
	d3.select("#btn-highlight-nonwhitewomen").on("click", (d) => highlightRepartition([0,0,1]) );
	d3.select("#btn-highlight-all").on("click", (d) => highlightRepartition([1,1,1]) );
	
	d3.select("#btn-animated").on("click", () => {
		redrawRepartitionChartAnimated(d3.select("#animated"),animatedRepartition);
	});
	
	d3.select("#btn-scatter-technical").on("click", () => {
		for(k=0;k<scatters.length;k++){
			switchTo(d3.select(scatters[k].id),scatters[k].svgProps,"tech_rank");
		}
	});
	
	d3.select("#btn-scatter-leadership").on("click", () => {
		for(k=0;k<scatters.length;k++){
			switchTo(d3.select(scatters[k].id),scatters[k].svgProps,"leadership_rank");
		}
	});
	
	d3.select("#btn-scatter").on("click", () => {
		for(k=0;k<scatters.length;k++){
			switchTo(d3.select(scatters[k].id),scatters[k].svgProps,"rank");
		}
	});
}

function setupIsotope(){

	// init Isotope
	var $grid = $('.chartContainer').isotope({
		itemSelector: '.chart',
		layoutMode: 'fitRows',
		getSortData: {
			company: (e) => {
				d = d3.select(e).datum();
				return d.company;
			},
			sector: (e) => {
				d = d3.select(e).datum();
				//console.log(d.sector);
				return d.sector;
			},
			employees: (e) => {
				d = d3.select(e).datum();
				return d.total_employees;
			},
			nonwhite: (e) => {
				d = d3.select(e).datum();
				return getValueSort(d,"Gnonwhite");
			},
			women: (e) => {
				d = d3.select(e).datum();
				return getValueSort(d,"Gwomen");
			},
			womenofcolor: (e) => {
				d = d3.select(e).datum();
				return getValueSort(d,"Gwomennonwhite");
			},
			rank: (e) => {
				d = d3.select(e).datum();
				return d.rank;
			},
			tech_rank: (e) => {
				d = d3.select(e).datum();
				return d.tech_rank;
			},
			leadership_rank: (e) => {
				d = d3.select(e).datum();
				return d.leadership_rank;
			}
		}
	});
	
	// bind filter button click
	$('.filters-button-group').on( 'click', 'button', function() {
	  var filterValue = $( this ).attr('data-filter');
	  console.log(filterValue);
	  //filterValue = filterFns[ filterValue ] || filterValue;
	  $grid.isotope({ filter: filterValue });
	});
	
	// bind sort button click
	$('.sort-by-button-group').on( 'click', 'button', function() {
	  var sortValue = $(this).attr('data-sort-value');
	  $grid.isotope({ sortBy: sortValue });
	});

	// change is-checked class on buttons
	$('.button-group').each( function( i, buttonGroup ) {
	  var $buttonGroup = $( buttonGroup );
	  $buttonGroup.on( 'click', 'button', function() {
		$buttonGroup.find('.is-checked').removeClass('is-checked');
		$( this ).addClass('is-checked');
	  });
	});	
	
}

function getValueSort(d,text){
	var perc ;
	//console.log(d);
	//var representationLabels = ["Gnonwhite","Gwomen","Gwomennonwhite","Tnonwhite","Twomen","Twomennonwhite","Lnonwhite","Lwomen","Lwomennonwhite"];
	for (i=0;i<representationLabels.length;i++){
		if(representationLabels[i] == text){
			//console.log(representationLabels[i],i);
			perc = d.representation_array[i].perc;
			//console.log(perc);
		}
	}
	return perc * -100;
}


function svgSetUp(svgId,svgProps) {

	var svg = d3.select(svgId)
		.attr("width", svgProps.width + svgProps.margin.left + svgProps.margin.right)
		.attr("height", svgProps.height + svgProps.margin.top + svgProps.margin.bottom)
		.append("g")
			.attr("transform", "translate(" + svgProps.margin.left + "," + svgProps.margin.top + ")");
			
	return svg;
}

function prepareData(inputData) {

	return inputData.map(function(d) {
	
		// Create a tab with the percentage of nonwhite, women and nonwhite women for Global, Tech and LEadership position
		var representationArray = [];
		
		// Gnonwhite,Gwomen,Gwomennonwhite,Tnonwhite,Twomen,Twomennonwhite,Lnonwhite,Lwomen,Lwomennonwhite
		// For each categoru, compute the percentage in the relative position : global, technical, leadership
		
		//total_employees,total_male,overall_male_white,overall_male_asian,overall_male_black,overall_male_latinx,overall_male_other,total_female,overall_female_white,overall_female_asian,overall_female_black,overall_female_latinx,overall_female_other,
		//total_technical,technical_male_white,technical_male_asian,technical_male_black,technical_male_latinx,technical_female_white,technical_female_asian,technical_female_black,technical_female_latinx,
		//leadership_total,leadership_male_white,leadership_male_asian,leadership_male_black,leadership_male_latinx,leadership_female_white,leadership_female_asian,leadership_female_black,leadership_female_latinx
		var computeRepresentation = [];
		var corrected_total_employees ;
		if (d.total_employees.includes(",")) {
			//console.log(d.total_employees.indexOf(","));
			// A refaire plus propre
			corrected_total_employees = +(d.total_employees[0] + d.total_employees[2] + d.total_employees[3] + d.total_employees[4]);
			//console.log(corrected_total_employees);
			//console.log(d.total_employees[0,2]);
		}
		else {
			corrected_total_employees = +d.total_employees;
		}
		//
		computeRepresentation.push( (+d.overall_male_asian + +d.overall_male_black + +d.overall_male_latinx + +d.overall_male_other + +d.overall_female_asian + +d.overall_female_black + +d.overall_female_latinx + +d.overall_female_other) / corrected_total_employees) ; /* Gnonwhite */
		computeRepresentation.push( (+d.total_female) / corrected_total_employees) ; /* Gwomen */
		computeRepresentation.push( (+d.overall_female_asian + +d.overall_female_black + +d.overall_female_latinx + +d.overall_female_other) / corrected_total_employees) ; /* Gwomennonwhite */
		//
		computeRepresentation.push( (+d.technical_male_asian + +d.technical_male_black + +d.technical_male_latinx + +d.technical_female_asian + +d.technical_female_black + +d.technical_female_latinx) / +d.total_technical) ; /* Tnonwhite */
		computeRepresentation.push( (+d.technical_female_white + +d.technical_female_asian + +d.technical_female_black + +d.technical_female_latinx) / +d.total_technical) ; /* Twomen */
		computeRepresentation.push( (+d.technical_female_asian + +d.technical_female_black + +d.technical_female_latinx) / +d.total_technical) ; /* Twomennonwhite */
		//
		computeRepresentation.push( (+d.leadership_male_asian + +d.leadership_male_black + +d.leadership_male_latinx + +d.leadership_female_asian + +d.leadership_female_black + +d.leadership_female_latinx) / +d.leadership_total) ; /* Lnonwhite */
		computeRepresentation.push( (+d.leadership_female_white + +d.leadership_female_asian + +d.leadership_female_black + +d.leadership_female_latinx) / +d.leadership_total) ; /* Lwomen */
		computeRepresentation.push( (+d.leadership_female_asian + +d.leadership_female_black + +d.leadership_female_latinx) / +d.leadership_total) ; /* Lwomennonwhite */
			
		for (i=0;i<representationLabels.length;i++){
			representationArray.push(
				{type: representationLabels[i], 
				perc: computeRepresentation[i]}
			);
		}
		
		var baseDTPdata = [
			{type: "white", perc: (+d.overall_male_white + +d.overall_female_white) / corrected_total_employees},
			{type: "asian", perc: (+d.overall_male_asian + +d.overall_female_asian) / corrected_total_employees},
			{type: "black", perc: (+d.overall_male_black + +d.overall_female_black) / corrected_total_employees},
			{type: "latix", perc: (+d.overall_male_latinx + +d.overall_female_latinx) / corrected_total_employees},
			{type: "others", perc: (+d.overall_male_other + +d.overall_female_other) / corrected_total_employees},
			{type: "men", perc: +d.total_male / corrected_total_employees},
			{type: "women", perc: +d.total_female / corrected_total_employees}
		];
		

		return {
			"company": d.company_name,
			"total_employees": corrected_total_employees,
			"rank": +d.overall_ranking,
			"tech_rank": +d.technical_ranking,
			"leadership_rank": +d.leadership_ranking,
			"sector": d.sector_1,
			"customer_base": d.customer_base_1,
			"representation_array": representationArray,
			"baseDTPdata": baseDTPdata
		};
		
	});

}
