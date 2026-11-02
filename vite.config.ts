import adapter from '@sveltejs/adapter-static';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        sveltekit({
            compilerOptions: {
                // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
                runes: ({filename}) =>
                    filename.split(/[/\\]/).includes('node_modules') ? undefined : true
            },
            preprocess: vitePreprocess({script: true}),
            adapter: adapter(),
            paths: {
                base: process.env.BASE_PATH ?? ''
            }
        }),
        tailwindcss(),
    ]
});
