<script lang="ts">
	import '$lib/style/app.scss';
	import GdprBanner from '$lib/components/CookieBanner.svelte';
	import ScatterPlot from '$lib/components/ScatterPlot.svelte';
	import Icon from '@iconify/svelte';
	import DarkmodeToggle from '$lib/components/DarkmodeToggle.svelte';
</script>

<GdprBanner
	cookieName="wbcm"
	description="We barely use cookies, but some are needed for functional purposes like theme preferences."
/>

<div class="container">
	<div class="header">
		<div class="padder" />
		<h1>Weight based contrast medium</h1>
		<div class="padder" />
		<div class="darkmode pointer">
			<DarkmodeToggle />
		</div>
	</div>
	<ScatterPlot
		url={'https://raw.githubusercontent.com/NeonSpork/weight-based-contrast/main/src/assets/wbcm.csv'}
	/>
	<!-- <Sunburst /> -->
	<!-- Maybe add controls for dynamic chart -->
	<div class="copyright">
		<p>
			<em
				>Copyright &#169 2022 - JB Leiknes. All rights reserved. <br /><a
					href="https://twitter.com/jb_leiknes"
					target="_blank"><Icon icon="fa-brands:twitter-square" /> @jb_leiknes</a
				>
				//
				<a href="https://github.com/NeonSpork" target="_blank"
					><Icon icon="jam:github" /> NeonSpork</a
				>
			</em>
		</p>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.copyright {
		text-align: center;
	}

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90%;
	}

	.padder {
		flex: 1 1 auto;
	}
	.pointer {
		cursor: pointer;
	}
</style>
