<script lang="ts">
	import DarkmodeToggle from '$lib/components/DarkmodeToggle.svelte';
</script>

<div class="sticky-header">
	<div class="header-banner">
		<div class="padder" />
		<div class="darkmode pointer">
			<DarkmodeToggle />
		</div>
	</div>
</div>

<style lang="scss">
	.sticky-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		margin: 0;
		width: 100vw;
		z-index: 3;
	}

	.header-banner {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 1rem;
	}

	.padder {
		flex: 1 1 auto;
	}

	.darkmode {
		margin-right: 12px;
		margin-top: 2px;
		// z-index: 0;
	}
	.pointer {
		cursor: pointer;
	}
</style>
