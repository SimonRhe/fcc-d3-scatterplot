// Simon Rhe
// April 2020

const DATA_URL = 'cyclist-data.json';
const PADDING = {
	top: 70,
	bottom: 70,
	left: 70,
	right: 200
};

const SVG_DIV = d3.select('#chart-div');
let svgElement = d3.select('#chart-svg');
let dataset = undefined;

d3
	.json(DATA_URL)
	.then((parsedData) => {
		dataset = parsedData.map((d) => {
			let parsedTime = d.Time.split(':');
			return {
				...d,
				TimeDate: new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1])),
				YearDate: new Date(Date.UTC(d.Year, 0, 1))
			};
		});
		console.log(`dataset[0].TimeDate.toUTCString(): ${dataset[0].TimeDate.toUTCString()}`);
		generateGraph(svgElement, dataset, PADDING);
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

function generateGraph(svg, dataset, padding, svgDiv = SVG_DIV) {
	const regexPx = /\d+/; // ignores decimals, 'px'
	const svgWidth = parseInt(svg.style('width').match(regexPx));
	const svgHeight = parseInt(svg.style('height').match(regexPx));

	let tooltipDiv = undefined;

	console.log(`dataset.length: ${dataset.length}
    svgWidth: ${svgWidth}
    svgHeight: ${svgHeight}`);

	// Generate axes and labels; adds 1 year before/after x-axis so that points don't display on borders
	let xExtent = d3.extent(dataset, (d) => d.YearDate);
	xExtent[0] = new Date(xExtent[0]).setUTCFullYear(xExtent[0].getUTCFullYear() - 1);
	xExtent[1] = new Date(xExtent[1]).setUTCFullYear(xExtent[1].getUTCFullYear() + 1);
	const xScale = d3.scaleUtc().domain(xExtent).range([ padding.left, svgWidth - padding.right ]);
	const yScale = d3
		.scaleUtc()
		.domain(d3.extent(dataset, (d) => d.TimeDate))
		.range([ padding.top, svgHeight - padding.bottom ]); // inverted y-axis
	const xAxis = d3.axisBottom(xScale);
	svg
		.append('g')
		.attr('transform', 'translate(0, ' + (svgHeight - padding.bottom) + ')')
		.attr('id', 'x-axis')
		.call(xAxis);
	const yTimeFormat = d3.timeFormat('%M:%S');
	const yAxis = d3.axisLeft(yScale).tickFormat(yTimeFormat);
	svg.append('g').attr('transform', 'translate(' + padding.left + ', 0)').attr('id', 'y-axis').call(yAxis);
	svg
		.append('text')
		.attr('class', 'axis-label')
		.attr('y', padding.left - 45)
		.attr('x', -svgHeight / 2)
		.text('Time (minutes)')
		.attr('transform', 'rotate(-90)');
	svg
		.append('text')
		.attr('class', 'axis-label')
		.attr('x', svgWidth / 2)
		.attr('y', svgHeight - padding.bottom + 40)
		.text('Year');

	// Generate legend for dot colors
	let numDoping = dataset.reduce((prev, current) => (current.Doping == '' ? prev : prev + 1), 0);
	let numNodoping = dataset.length - numDoping;
	let legendG = svg
		.append('g')
		.attr('id', 'legend')
		.attr('transform', 'translate(' + (svgWidth - 190) + ', ' + (svgHeight / 3 - 10) + ')');
	legendG.append('rect').attr('height', 70).attr('width', 170).attr('class', 'legend-container-rect');
	legendG
		.append('circle')
		.attr('cx', 18)
		.attr('cy', 20)
		.attr('r', 7)
		.attr('height', 20)
		.attr('width', 20)
		.attr('class', 'legend-circle no-doping');
	legendG
		.append('text')
		.attr('x', 37)
		.attr('y', 25)
		.attr('class', 'legend-text')
		.text('No doping allegations (' + numNodoping + ')');
	legendG
		.append('circle')
		.attr('cx', 18)
		.attr('cy', 52)
		.attr('r', 7)
		.attr('height', 20)
		.attr('width', 20)
		.attr('class', 'legend-circle with-doping');
	legendG
		.append('text')
		.attr('x', 37)
		.attr('y', 55)
		.attr('class', 'legend-text')
		.text('Doping allegations (' + numDoping + ')');

	// Generate dots and link to tooltip
	const dotRadius = 5;
	svg
		.selectAll('circle')
		.data(dataset)
		.enter()
		.append('circle')
		.attr('class', (d) => (d.Doping == '' ? 'dot no-doping' : 'dot with-doping'))
		.attr('cx', (d, i) => xScale(d.YearDate))
		.attr('cy', (d, i) => yScale(d.TimeDate))
		.attr('r', dotRadius)
		.attr('data-xvalue', (d) => d.YearDate.toISOString())
		.attr('data-yvalue', (d) => d.TimeDate.toISOString())
		.on('mouseover', (d, i) => {
			let newHtml = [
				'<strong>' + d.Name + '</strong>',
				'Nationality: ' + d.Nationality,
				'Year: ' + d.Year,
				'Time: ' + d.Time,
				'Place: ' + d.Place,
				d.Doping == '' ? '' : 'Allegations: ' + d.Doping
			].join('<br>');
			if (d.URL != '') {
				newHtml += '<br><strong><em>Click to see source</em></strong>';
			}	
			tooltipDiv
				.attr('class', d.Doping == '' ? 'tooltip-div tooltip-no-doping' : 'tooltip-div tooltip-with-doping')
				.html(newHtml)
				.attr('data-year', d.YearDate.toISOString())
				.attr('data-xvalue', xScale(d.YearDate))
				.style('opacity', 0.9)
				.style('left', d3.event.pageX + 10 + 'px')
				.style('top', d3.event.pageY - 28 + 'px');
		})
		.on('mouseout', (d, i) => {
			tooltipDiv.style('opacity', 0);
		})
		.on('click', (d, i) => {
			if (d.URL != '') {
				window.open(d.URL, '_blank');
			}
		});

	// Generate tooltip
	tooltipDiv = svgDiv.append('div').attr('id', 'tooltip').attr('class', 'tooltip-div').style('opacity', 0);

}
