import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import zipPack from 'vite-plugin-zip-pack';
import { version } from './package.json';

const rootDir = resolve(import.meta.dirname, 'src');
const outDir = resolve(import.meta.dirname, 'dist');

export default defineConfig(({ mode }) => ({
    root: rootDir,
    publicDir: resolve(import.meta.dirname, 'public'),
    resolve: {
        alias: {
            src: rootDir,
        },
    },
    plugins: [
        react(),
        tailwindcss(),
        mode === 'production' &&
            zipPack({
                inDir: outDir,
                outDir: resolve(import.meta.dirname, 'release'),
                outFileName: `build-chrome-${version}.zip`,
                enableLogging: false,
            }),
    ],
    build: {
        outDir,
        emptyOutDir: true,
        modulePreload: false,
        assetsInlineLimit: 0,
        sourcemap: mode === 'development' ? 'inline' : false,
        minify: mode === 'production',
        rolldownOptions: {
            input: {
                popup: resolve(rootDir, 'popup.html'),
                worker: resolve(rootDir, 'worker/index.ts'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: 'chunks/[name].js',
                assetFileNames: 'assets/[name][extname]',
            },
        },
    },
}));
