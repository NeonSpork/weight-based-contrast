<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	async function sunburstPlot(data) {
		const margin = { top: 20, right: 20, bottom: 50, left: 70 };
		let width = window.innerWidth * 0.75 - margin.left - margin.right;
		let height = window.innerWidth * 0.375 - margin.top - margin.bottom;
		let radius = Math.min(width, height) / 2;
		let color = d3.scaleOrdinal(d3.schemeCategory10);

		console.log(data);
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
				return 'red';
				return color((d.children ? d : d.parent).data.name);
			});
	}

	onMount(async () => {
		sunburstPlot(
			await d3.csv(
				'https://raw.githubusercontent.com/NeonSpork/weight-based-contrast/main/src/assets/wbcm.csv'
			)
		);
	});
</script>

<div id="sunburst" />
