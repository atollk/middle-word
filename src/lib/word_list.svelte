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


<div class="flex flex-wrap items-center flex-col">
    {#each props.words as word}
        <div class="flex flex-col">
            <p class="text-sm">
                {#if word.distanceToMiddle < 0}
                    {-word.distanceToMiddle}
                {/if}
            </p>
            <p class="label">
                {#if word.distanceToMiddle == 0}
                    ?
                {:else}
                    {word.word}
                {/if}
            </p>
            <p class="text-sm">
                {#if word.distanceToMiddle > 0}
                    {word.distanceToMiddle}
                {/if}
            </p>
        </div>
    {/each}
</div>
