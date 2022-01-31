<script type="ts">
	import { theme } from '$lib/store';
	import Icon from '@iconify/svelte';
	import { slide, blur } from 'svelte/transition';
	import { onMount } from 'svelte';

	export function applyTheme() {
		// On page load or when changing themes,
		// best to add inline in `head` to avoid FOUC
		if ($theme === 'light') {
			document.documentElement.classList.remove('theme-dark');
			document.documentElement.classList.add('theme-light');
		} else if ($theme === 'dark') {
			document.documentElement.classList.add('theme-dark');
			document.documentElement.classList.remove('theme-light');
		}
	}

	function toggleTheme() {
		$theme = $theme === 'dark' ? 'light' : 'dark';
		applyTheme();
	}
	onMount(applyTheme);
</script>

<div class="menu_icon" on:click={() => toggleTheme()}>
	{#if $theme === 'dark'}
		<div transition:slide>
			<div transition:blur>
				<Icon icon="fa-solid:moon" />
			</div>
		</div>
	{:else}
		<div transition:slide>
			<div transition:blur>
				<Icon icon="fa-solid:sun" />
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.menu_icon {
		// margin: 8px 4px 8px;
		width: 16px;
		height: 16px;
		transition: all 300ms cubic-bezier(1, 0, 0.67, 1);
	}
</style>
