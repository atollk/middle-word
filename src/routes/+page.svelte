<script lang="ts">
	import { onMount } from 'svelte';
	import middleWordsRaw from '#lib/assets/middle_words_eng.txt?raw';
	import dictRaw from '#lib/assets/dict_eng.txt?raw';

	function submit(event: SubmitEvent) {
		event.preventDefault();
		console.log('submitted');
	}

	const word_distance = 10_000;

	const read_lines = (text: string) =>
		text
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);

	const all_words = read_lines(dictRaw);
	const middle_word_candidates = read_lines(middleWordsRaw).toSorted();

	let words = $state<{ left: string; middle: string; right: string }>();

	onMount(() => {
		const middle =
			middle_word_candidates[Math.floor(Math.random() * middle_word_candidates.length)];
		const position = all_words.indexOf(middle);
		words = {
			left: all_words[position - word_distance],
			middle,
			right: all_words[position + word_distance]
		};
	});
</script>

<form onsubmit={submit}>
	{#if words}
		{words.left}
		{words.middle}
		{words.right}
	{/if}

	<input />
</form>
