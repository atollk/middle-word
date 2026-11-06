<script lang="ts">
    import {onMount} from 'svelte'
    import middleWordsRaw from '#lib/assets/middle_words_eng.txt?raw'
    import dictRaw from '#lib/assets/dict_eng.txt?raw'
    import {styleFromDistance} from "#lib/color.ts";
    import {check} from "prettier";

    interface Word {
        word: string;
        distanceToMiddle: number;
    }

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
    let middleGuessed = $state<boolean>(false)

    onMount(() => {
        let tmpWords: Word[] = []
        while (tmpWords.length < 3 || !tmpWords.every(word => word.word)) {
            const middle =
                middle_word_candidates[Math.floor(Math.random() * middle_word_candidates.length)]
            const position = dictionary.indexOf(middle)
            const leftStart = dictionary[position - word_distance]
            const rightStart = dictionary[position + word_distance]
            tmpWords = [
                {word: leftStart, distanceToMiddle: word_distance},
                {word: middle, distanceToMiddle: 0},
                {word: rightStart, distanceToMiddle: -word_distance},
            ]
        }
        console.log(tmpWords)
        words = tmpWords
    });

    function getMiddleWord(): [number, string] {
        const i = words.findIndex((w) => w.distanceToMiddle == 0)
        return [i, words[i].word]
    }

    function checkSubmission(word: string) {
        const wordIndex = dictionary.indexOf(word)
        if (wordIndex == -1) {
            console.error(`${inputWord} is not a valid word`)
            return
        }
        const [middleWordPos, middleWord] = getMiddleWord()
        const wordDistance = dictionary.indexOf(middleWord) - dictionary.indexOf(word)
        const leftNeighborPosI = words.findLastIndex((w) => w.distanceToMiddle > wordDistance)
        const leftNeighborPos = leftNeighborPosI < 0 ? null : leftNeighborPosI
        const rightNeighborPosI = words.findIndex((w) => w.distanceToMiddle < wordDistance)
        const rightNeighborPos = rightNeighborPosI < 0 ? null : rightNeighborPosI

        if (
            leftNeighborPos == null ||
            rightNeighborPos == null ||
            (leftNeighborPos < middleWordPos && rightNeighborPos < middleWordPos) ||
            (leftNeighborPos > middleWordPos && rightNeighborPos > middleWordPos)
        ) {
            console.error(`${inputWord} is not in the middle of previous guesses`)
            return
        }

        if (word === middleWord) {
            console.log("success!")
            middleGuessed = true
            return
        }

        words.splice(leftNeighborPos + 1, 0, {word: word, distanceToMiddle: wordDistance})
    }

    function submit(event: SubmitEvent) {
        event.preventDefault()
        const word = inputWord.trim()
        inputWord = ""
        checkSubmission(word)
    }
</script>

<form onsubmit={submit} class="flex items-center flex-col">
    {#if words}
        <div class="flex flex-wrap items-center flex-col">
            {#each words as word (word.word)}
                <div class="flex flex-col items-center w-full gap-2">
                    <p class="text-xs">
                        {#if word.distanceToMiddle < 0}
                            {-word.distanceToMiddle}
                        {/if}
                    </p>
                    <div>
                        {#if word.distanceToMiddle != 0 || middleGuessed}
                            <p class="label text-2xl" style={styleFromDistance(word.distanceToMiddle, 10_000)}>
                                {word.word}
                            </p>
                        {:else}
                            <input class="input" bind:value={inputWord}/>
                        {/if}
                    </div>
                    <p class="text-xs">
                        {#if word.distanceToMiddle > 0}
                            {word.distanceToMiddle}
                        {/if}
                    </p>
                </div>
            {/each}
        </div>
    {/if}
</form>
