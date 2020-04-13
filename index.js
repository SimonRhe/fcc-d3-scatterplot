// Simon Rhe
// April 2020

const DATA_URL = 'cyclist-data.json';
const PADDING = 50; // px
// const DATE_REGEX = /(\d{4})-(\d{2})-(\d{2})/; // eg.: "1946-01-01"

const SVG_DIV = d3.select('#chart-div');
let svgElement = d3.select('#chart-svg');
let dataset = undefined;

d3
	.json(DATA_URL)
	.then((parsedData) => {
        console.log(`typeof parsedData: ${typeof parsedData}
        parsedData.length: ${parsedData.length}`);

        // TODO: create Date objects for minutes (and years?)
		dataset = parsedData;
	})
	.catch((error) => console.log('error: ' + error));

// TODO: redraw SVG when window size changes
/*
window.onresize = () => {
    console.log('Window resized ' + Date.now());
    if (dataYear != undefined) {
        generateGraph(SVG_ITEM, dataYear, PADDING);
    }
};
*/
/*
fetch(DATA_URL)
	.then((response) => {
		if (response.status === 200) {
			return response.json();
		} else {
			throw new Error('Server error: ' + response.status);
		}
	})
	.then((jsondata) => {
		console.log('data received: ' + jsondata.description);
		document.getElementById('description').innerHTML =
            jsondata.description.replace(/\n/g, '<br>') + '<br>Source: ' + jsondata.source_name;
        dataYear = jsondata.data.map((d) => [ parseDate(d[0]), d[1], d[0] ]); //  new format [Date object, GDP, date string]
		generateGraph(SVG_ITEM, dataYear, PADDING);
	})
	.catch((error) => console.log('error: ' + error));
*/

/*
function parseDate(str) {
	let result = DATE_REGEX.exec(str);
	return new Date(Date.UTC(result[1], result[2] - 1, result[3]));
}

/* Data example 

{
    "Time": "36:50",
    "Place": 1,
    "Seconds": 2210,
    "Name": "Marco Pantani",
    "Year": 1995,
    "Nationality": "ITA",
    "Doping": "Alleged drug use during 1995 due to high hematocrit levels",
    "URL": "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
  }
  
*/

/*
function generateGraph(svg, dataYear, padding) {
	const regexPx = /\d+/; // ignores decimals, 'px'
	const svgWidth = parseInt(svg.style('width').match(regexPx));
	const svgHeight = parseInt(svg.style('height').match(regexPx));

	const maxValue = d3.max(dataYear, (d) => d[1]);

	console.log(`dataYear.length: ${dataYear.length}
    maxvalue: ${maxValue}
    svgWidth: ${svgWidth}
    svgHeight: ${svgHeight}`);

	const xScale = d3.scaleUtc().domain(d3.extent(dataYear, (d) => d[0])).range([ padding, svgWidth - padding ]);
	const yScale = d3.scaleLinear().domain([ 0, maxValue ]).range([ svgHeight - padding, padding ]);
    const barWidth = (svgWidth - padding * 2) / dataYear.length;
    
    // workaround to pass fCC test
    let tooltip = svg.append('text')
    .attr('x', 0.2*svgWidth)
    .attr('y', 0.2*svgHeight)
    .attr('height', '50px')
    .attr('id', 'tooltip')
    .text('');

	svg
		.selectAll('rect')
		.data(dataYear)
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr('data-date', (d) => d[2])
		.attr('data-gdp', (d) => d[1])
		.attr('x', (d, i) => xScale(d[0]))
		.attr('y', (d, i) => yScale(d[1]))
		.attr('width', barWidth)
        .attr('height', (d, i) => svgHeight - padding - yScale(d[1]))
        .on('mouseover', (d, i) => {
            tooltip.text( d[2] + '; ' + '$' + d[1] + 'b');
            tooltip.attr('data-date', d[2]);
            tooltip.style('opacity', 0.9);
        })
        .on('mouseout', (d, i) => {
            tooltip.text('');
            tooltip.attr('data-date', '');
            tooltip.style('opacity', 0);
        })
        .append('title')
		.text((d, i) => 'Data Point #' + i + ':\n' + d[2] + '\n' + '$' + d[1] + 'b');


	const yAxis = d3.axisLeft(yScale);
	svg.append('g').attr('transform', 'translate(' + padding + ', 0)').attr('id', 'y-axis').call(yAxis);
	const xAxis = d3.axisBottom(xScale);
    svg.append('g').attr('transform', 'translate(0, ' + (svgHeight - padding) + ')').attr('id', 'x-axis').call(xAxis);
    
    
}
*/
