<script lang="ts">
	import '$lib/style/app.scss';
	import GdprBanner from '$lib/components/CookieBanner.svelte';
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';

	onMount(async () => {
		const margin = { top: 20, right: 20, bottom: 50, left: 70 };
		let width = 1060 - margin.left - margin.right;
		let height = 400 - margin.top - margin.bottom;

		let svg = d3
			.select('#dataviz')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);
		let x = d3.scaleLinear().domain([0, 1000]).range([0, width]);
		svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));
		// BMI
		let y = d3.scaleLinear().domain([0, 50]).range([height, 0]);
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

		const data = await d3.csv(
			'https://raw.githubusercontent.com/NeonSpork/weight-based-contrast/main/src/assets/wbcm.csv'
		);

		const lowQuality = d3.scaleOrdinal().domain(['1', '0']).range(['#f5eb26', '#a52499']);

		svg
			.append('g')
			.selectAll('dot')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', function (d) {
				return x(d.aorta);
			})
			.attr('cy', (d) => {
				return y(d.bmi);
			})
			.attr('r', 3)
			.style('fill', (d) => {
				return lowQuality(d.low_quality);
			});
	});
</script>

<Header />
<GdprBanner
	cookieName="wbcm"
	description="We barely use cookies, but some are needed for functional purposes like theme preferences."
/>

<div class="container">
	<h1>Weight based contrast medium</h1>
	<div id="dataviz" />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
