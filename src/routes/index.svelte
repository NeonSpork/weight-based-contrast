<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import GdprBanner from '$lib/components/CookieBanner.svelte';
	import ScatterPlot from '$lib/components/ScatterPlot.svelte';
	import '$lib/style/app.scss';
</script>

<Header />
<GdprBanner
	cookieName="wbcm"
	description="We barely use cookies, but some are needed for functional purposes like theme preferences."
/>

<div class="container">
	<h1>Weight based contrast medium</h1>
	<ScatterPlot />
	<!-- Put a tree thing here? -->
	<!-- Maybe add controls for dynamic chart -->
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
