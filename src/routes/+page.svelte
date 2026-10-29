<script lang="ts">
    import {onMount} from 'svelte'
    import middleWordsRaw from '#lib/assets/middle_words_eng.txt?raw'
    import dictRaw from '#lib/assets/dict_eng.txt?raw'
	import WordList, {type Word} from '#lib/word_list.svelte';

    const word_distance = 10_000

    const read_lines = (text: string) =>
        text
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)

    const dictionary = read_lines(dictRaw)
    const middle_word_candidates = read_lines(middleWordsRaw).toSorted().filter((w) => w.length >= 3)

    let words = $state<Word[]>([])
    let inputWord = $state<string>("")

    onMount(() => {
        const middle =
            middle_word_candidates[Math.floor(Math.random() * middle_word_candidates.length)]
        const position = dictionary.indexOf(middle)
        const leftStart = dictionary[position - word_distance]
        const rightStart = dictionary[position + word_distance]
        words = [
            {word: leftStart, distanceToMiddle: word_distance},
            {word: middle, distanceToMiddle: 0},
            {word: rightStart, distanceToMiddle: -word_distance},
        ]
    });

    function getMiddleWord(): [number, string] {
        const i = words.findIndex((w) => w.distanceToMiddle == 0)
        return [i, words[i].word]
    }

    function submit(event: SubmitEvent) {
        event.preventDefault()
        const word = inputWord.trim()
        inputWord = ""

        const wordIndex = dictionary.indexOf(word)
        if (wordIndex == -1) {
            console.error(1)
            // TODO
            return
        }
        const [middleWordPos, middleWord] = getMiddleWord()
        const wordDistance = dictionary.indexOf(middleWord) - dictionary.indexOf(word)
        const leftNeighborPosI = words.findLastIndex((w) => w.distanceToMiddle > wordDistance)
        const leftNeighborPos = leftNeighborPosI < 0 ? null : leftNeighborPosI
        const rightNeighborPosI = words.findIndex((w) => w.distanceToMiddle < wordDistance)
        const rightNeighborPos = rightNeighborPosI < 0 ? null : rightNeighborPosI

        console.log(leftNeighborPos, rightNeighborPos)
        if (
            leftNeighborPos == null ||
            rightNeighborPos == null ||
            (leftNeighborPos < middleWordPos && rightNeighborPos < middleWordPos) ||
            (leftNeighborPos > middleWordPos && rightNeighborPos > middleWordPos)
        ) {
            console.error(2)
            // TODO
            return
        }

        words.splice(leftNeighborPos + 1, 0, {word: word, distanceToMiddle: wordDistance})
    }
</script>

<form onsubmit={submit} class="flex items-center flex-col">
    {#if words}
        <WordList words={words}/>
    {/if}

    <input class="input" bind:value={inputWord}/>
</form>
