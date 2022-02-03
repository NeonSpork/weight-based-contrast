<script lang="ts">
	import * as d3 from 'd3';
	import type { PatientType } from '$lib/types/Patient';
	import { onMount } from 'svelte';

	export let url = '';

	let labels = [
		'age',
		'aorta',
		'ave_pulse',
		'betablocker',
		'bmi',
		'bsa',
		'cm_per_kg',
		'gender',
		'height',
		'low_quality',
		'nitro',
		'patient',
		'weight'
	];
	let descriptiveLabel = {
		age: 'Age in years',
		aorta: 'Attenuation in aorta',
		ave_pulse: 'Average pulse',
		betablocker: 'Beta-blockers administered',
		bmi: 'Body Mass Index',
		bsa: 'Body Surface Area',
		cm_per_kg: 'Ml contrast medium per kg bodyweight',
		gender: 'Biological gender',
		height: 'Height in cm',
		low_quality: 'Quality of examination',
		nitro: 'Sublingual nitroglycerine administered',
		patient: 'Unique anonymous identifier',
		weight: 'Weight in kg'
	};

	$: xAxis = 'aorta';
	$: yAxis = 'bsa';
	$: total = 0;

	async function scatterPlot(data: Array<PatientType>) {
		let xArray = [];
		let yArray = [];

		function populateArray(label: string): Array<any> {
			let array = [];
			data.forEach((d: PatientType) => {
				if (Number.isNaN(parseFloat(d[label]))) {
					array.push(d[label]);
				} else {
					array.push(parseFloat(d[label]));
				}
			});
			return array;
		}

		function limitAxis(arr: Array<any>, coords: Array<number>) {
			if (!Number.isNaN(parseFloat(arr[0]))) {
				const min = d3.min(arr) * 0.9;
				const max = d3.max(arr) * 1.1;
				return d3.scaleLinear().domain([min, max]).range(coords);
			} else {
				return d3.scaleBand().domain(arr).range(coords);
			}
		}

		const margin = { top: 50, right: 50, bottom: 50, left: 70 };
		let minWidth = window.innerWidth * 0.75 >= 400 ? window.innerWidth * 0.75 : 400;
		let width = minWidth - margin.left - margin.right;
		let minHeight = window.innerWidth * 0.3 >= 400 ? window.innerWidth * 0.3 : 400;
		let height = minHeight - margin.top - margin.bottom;

		let scatterOuter = d3
			.select('#scatter')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom * 2)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		let scatterInner = scatterOuter.append('g');

		let x = limitAxis(populateArray(xAxis), [0, width]);

		scatterInner.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));
		let y = limitAxis(populateArray(yAxis), [height, 0]);
		scatterInner.append('g').call(d3.axisLeft(y));

		scatterInner
			.append('text')
			.attr('transform', `translate(${width / 2}, ${height + margin.bottom})`)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text(descriptiveLabel[xAxis]);

		scatterInner
			.append('text')
			.attr('transform', `rotate(-90)`)
			.attr('y', 0 - margin.left)
			.attr('x', 0 - height / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text(descriptiveLabel[yAxis]);

		scatterInner
			.append('g')
			.append('circle')
			.attr('cx', margin.left / 2)
			.attr('cy', 10 - margin.top)
			.attr('r', 5)
			.style('fill', '#f5eb26');
		scatterInner
			.append('text')
			.attr('transform', `translate(${margin.left * 1.6}, ${0 - margin.top})`)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('suboptimal quality');

		scatterInner
			.append('g')
			.append('circle')
			.attr('cx', margin.left / 2)
			.attr('cy', 25 - margin.top)
			.attr('r', 5)
			.style('fill', '#a52499');
		scatterInner
			.append('text')
			.attr('transform', `translate(${margin.left * 1.6}, ${15 - margin.top})`)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('acceptable quality');

		const lowQuality = d3.scaleOrdinal().domain(['1', '0']).range(['#f5eb26', '#561fa4']);

		scatterInner
			.append('g')
			.selectAll('dot')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', (d: PatientType) => {
				return x(d[xAxis]);
			})
			.attr('cy', (d: PatientType) => {
				// console.log(`x: ${d[xAxis]} y: ${d[yAxis]}`);
				return y(d[yAxis]);
			})
			.attr('r', 3)
			.style('fill', (d: PatientType) => {
				return lowQuality(d.low_quality);
			});
	}

	onMount(async () => {
		const data: Array<PatientType> = await d3.csv(url);
		total = data.length;
		await scatterPlot(data);
		window.addEventListener('resize', async () => {
			d3.selectAll('svg').remove();
			await scatterPlot(data);
		});
	});
</script>

<div>
	<label for="yAxis">Y axis</label><select
		bind:value={yAxis}
		on:change={async () => {
			d3.selectAll('svg').remove();
			scatterPlot(await d3.csv(url));
		}}
	>
		{#each labels as label}
			<option value={label}>{label}</option>
		{/each}
	</select>
	<label for="xAxis">X axis</label><select
		bind:value={xAxis}
		on:change={async () => {
			d3.selectAll('svg').remove();
			scatterPlot(await d3.csv(url));
		}}
	>
		{#each labels as label}
			<option value={label}>{label}</option>
		{/each}
	</select>
</div>
<p>Total number of participants - {total}</p>
<div id="scatter" />
