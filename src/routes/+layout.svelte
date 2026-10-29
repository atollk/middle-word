<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	let dark = $state(false);

	onMount(() => {
		const explicit = document.documentElement.dataset.theme;
		dark = explicit
			? explicit === 'dark'
			: window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	function toggle() {
		dark = !dark;
		const theme = dark ? 'dark' : 'light';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {
			// storage unavailable (e.g. private mode); theme just won't persist
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<button type="button" onclick={toggle} aria-pressed={dark}>
	{dark ? 'Light mode' : 'Dark mode'}
</button>

{@render children()}
