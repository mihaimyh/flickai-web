import { defineConfig } from 'vite'
import path, { resolve } from 'path'
import { glob } from 'glob'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    // Set base to '/' for custom domain (flickai.net)
    base: '/',
    plugins: [
        tailwindcss(),
        // ViteImageOptimizer({
        //     png: { quality: 80 },
        //     jpeg: { quality: 80 },
        //     jpg: { quality: 80 },
        //     webp: { quality: 80 },
        //     svg: null
        // })
    ],
    build: {
        rollupOptions: {
            input: Object.fromEntries(
                glob.sync('**/*.html', {
                    ignore: ['node_modules/**', 'dist/**', 'public/**', 'src/**', '.agent/**']
                }).map(file => [
                    // This removes the file extension from each
                    // file, so e.g. nested/foo.js becomes nested/foo
                    file.slice(0, file.length - path.extname(file).length),
                    // This expands the relative paths to absolute paths, so e.g.
                    // src/nested/foo becomes /project/src/nested/foo.js
                    resolve(__dirname, file)
                ])
            ),
        },
    },
})
