import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const paths = [
    resolve(root, 'package.json'),
    resolve(root, 'package-lock.json'),
    resolve(root, 'public/manifest.json'),
];
const [pkg, lock, manifest] = await Promise.all(
    paths.map(async (path) => JSON.parse(await readFile(path, 'utf8')))
);

const current = pkg.version;
const parts = /^(\d+)\.(\d+)\.(\d+)$/.exec(current);

if (!parts) throw new Error(`Invalid version: ${current}`);
if (
    [lock.version, lock.packages[''].version, manifest.version].some(
        (version) => version !== current
    )
) {
    throw new Error('Package, lockfile, and manifest versions must match.');
}

const next = `${parts[1]}.${parts[2]}.${Number(parts[3]) + 1}`;

pkg.version = next;
lock.version = next;
lock.packages[''].version = next;
manifest.version = next;

await Promise.all(
    [pkg, lock, manifest].map((data, index) =>
        writeFile(paths[index], `${JSON.stringify(data, null, 2)}\n`)
    )
);

console.log(`Bumped version: ${current} -> ${next}`);
