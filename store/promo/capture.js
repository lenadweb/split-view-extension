import { execFile } from 'node:child_process';
import {
    accessSync,
    constants,
    mkdirSync,
    readFileSync,
    rmSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { createServer } from 'vite';
import targets from './targets.json' with { type: 'json' };

const run = promisify(execFile);
const promoRoot = import.meta.dirname;
const outputDir = resolve(promoRoot, '../assets');
const chromeCandidates = {
    darwin: [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ],
    linux: [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
    ],
    win32: [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ],
};

function findChrome() {
    const candidates = [
        process.env.CHROME_PATH,
        ...(chromeCandidates[process.platform] ?? []),
    ].filter(Boolean);
    const path = candidates.find((candidate) => {
        try {
            accessSync(candidate, constants.X_OK);
            return true;
        } catch {
            return false;
        }
    });
    if (!path) throw new Error('Chrome not found. Set CHROME_PATH.');
    return path;
}

function selectTargets(filter) {
    const selected = filter
        ? targets.filter(
              ({ id, file }) => id.includes(filter) || file.includes(filter)
          )
        : targets;
    if (!selected.length) {
        throw new Error(`No image matches ${filter}`);
    }
    return selected;
}

async function capture(chrome, baseUrl, target) {
    const output = resolve(outputDir, target.file);
    rmSync(output, { force: true });
    await run(
        chrome,
        [
            '--headless=new',
            '--disable-gpu',
            '--hide-scrollbars',
            '--force-device-scale-factor=1',
            `--window-size=${target.width},${target.height}`,
            '--virtual-time-budget=5000',
            `--screenshot=${output}`,
            `${baseUrl}?asset=${target.id}`,
        ],
        { timeout: 90_000, killSignal: 'SIGKILL' }
    );

    const png = readFileSync(output);
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    if (
        width !== target.width ||
        height !== target.height ||
        png.length < 10_000
    ) {
        throw new Error(
            `${target.file}: invalid image (${width}×${height}, ${png.length} bytes)`
        );
    }
    console.log(`${target.file}: ${width}×${height}`);
}

async function main() {
    const chrome = findChrome();
    const selected = selectTargets(process.argv[2]);
    const server = await createServer({
        configFile: resolve(promoRoot, 'vite.config.ts'),
        server: { port: 0, strictPort: false },
    });
    await server.listen();

    try {
        const baseUrl = server.resolvedUrls?.local?.[0];
        if (!baseUrl) throw new Error('Vite did not report a local URL');
        mkdirSync(outputDir, { recursive: true });
        for (const target of selected) await capture(chrome, baseUrl, target);
    } finally {
        await server.close();
    }
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
