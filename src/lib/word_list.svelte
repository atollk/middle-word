<script lang="ts">
    export interface Word {
        word: string;
        distanceToMiddle: number;
    }

    interface Props {
        words: Word[];
    }

    let props: Props = $props()
</script>


<div class="wordList">
    {#each props.words as word}
        <p>
            {word.word}
        </p>
    {/each}
</div>

<style>
    .wordList {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: column;
    }
</style>