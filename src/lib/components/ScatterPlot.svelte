<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	async function scatterPlot(data) {
		const margin = { top: 20, right: 20, bottom: 50, left: 70 };
		let width = window.innerWidth * 0.75 - margin.left - margin.right;
		let height = window.innerWidth * 0.375 - margin.top - margin.bottom;

		let svg = d3
			.select('#scatter')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);
		let x = d3.scaleLinear().domain([175, 800]).range([0, width]);
		svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));
		let y = d3.scaleLinear().domain([13, 45]).range([height, 0]);
		svg.append('g').call(d3.axisLeft(y));

		svg
			.append('text')
			.attr('transform', `translate(${width / 2}, ${height + margin.top})`)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('Attentuation in aorta');

		svg
			.append('text')
			.attr('transform', `rotate(-90)`)
			.attr('y', 0 - margin.left)
			.attr('x', 0 - height / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('BMI');

		svg
			.append('g')
			.append('circle')
			.attr('cx', margin.left / 2)
			.attr('cy', height - margin.bottom)
			.attr('r', 5)
			.style('fill', '#f5eb26');
		svg
			.append('text')
			.attr('transform', `translate(${margin.left * 1.6}, ${height - margin.bottom - 10})`)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('suboptimal quality');

		svg
			.append('g')
			.append('circle')
			.attr('cx', margin.left / 2)
			.attr('cy', height - margin.bottom + 20)
			.attr('r', 5)
			.style('fill', '#a52499');
		svg
			.append('text')
			.attr('transform', `translate(${margin.left * 1.6}, ${height - margin.bottom + 10})`)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('acceptable quality');

		const lowQuality = d3.scaleOrdinal().domain(['1', '0']).range(['#f5eb26', '#561fa4']);

		svg
			.append('g')
			.selectAll('dot')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', (d) => {
				return x(d.aorta);
			})
			.attr('cy', (d) => {
				return y(d.bmi);
			})
			.attr('r', 3)
			.style('fill', (d) => {
				return lowQuality(d.low_quality);
			});
	}
	async function sunburstPlot(data) {
		const margin = { top: 20, right: 20, bottom: 50, left: 70 };
		let width = window.innerWidth * 0.75 - margin.left - margin.right;
		let height = window.innerWidth * 0.375 - margin.top - margin.bottom;
		let radius = Math.min(width, height) / 2;
		let color = d3.scaleOrdinal(d3.schemeCategory10);

		// Create primary <g> element
		let svg = d3
			.select('#sunburst')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

		// Data strucure
		let partition = d3.partition().size([2 * Math.PI, radius]);

		// Find data root
		let root = d3.hierarchy(data).sum((d) => {
			return d.size;
		});

		// Size arcs
		partition(root);
		let arc = d3
			.arc()
			.startAngle((d) => {
				return d.x0;
			})
			.endAngle((d) => {
				return d.x1;
			})
			.innerRadius((d) => {
				return d.y0;
			})
			.outerRadius((d) => {
				return d.y1;
			});

		// Put it all together
		svg
			.selectAll('path')
			.data(root.descendants())
			.enter()
			.append('path')
			.attr('display', (d) => {
				return d.depth ? null : 'none';
			})
			.attr('d', arc)
			.style('stroke', '#fff')
			.style('fill', (d) => {
				return color((d.children ? d : d.parent).data.name);
			});
	}

	onMount(async () => {
		const data = await d3.csv(
			'https://raw.githubusercontent.com/NeonSpork/weight-based-contrast/main/src/assets/wbcm.csv'
		);
		await scatterPlot(data);
		await sunburstPlot(data);
	});
</script>

<div id="scatter" />
<div id="sunburst" />
