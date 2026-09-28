export type Side = 'left' | 'right';
export type SplitPair = { id: number; tabs: [chrome.tabs.Tab, chrome.tabs.Tab] };

type SplitTabsApi = typeof chrome.tabs & {
    createSplit: (tabIds: [number, number]) => Promise<number>;
    unsplit: (splitViewId: number) => Promise<void>;
};

const api = (): SplitTabsApi => chrome.tabs as SplitTabsApi;
export const SPLIT_NONE = -1;
export const splitId = (tab: chrome.tabs.Tab): number => tab.splitViewId ?? SPLIT_NONE;
export const isSplit = (tab: chrome.tabs.Tab): boolean => splitId(tab) !== SPLIT_NONE;

export const isCompatible = (base: chrome.tabs.Tab, candidate: chrome.tabs.Tab): boolean =>
    candidate.id !== undefined &&
    candidate.id !== base.id &&
    !isSplit(candidate) &&
    candidate.windowId === base.windowId &&
    candidate.pinned === base.pinned &&
    candidate.groupId === base.groupId;

export function getPairs(tabs: chrome.tabs.Tab[]): SplitPair[] {
    const groups = new Map<number, chrome.tabs.Tab[]>();
    for (const tab of tabs) {
        const id = splitId(tab);
        if (id === SPLIT_NONE) continue;
        groups.set(id, [...(groups.get(id) ?? []), tab]);
    }
    return [...groups]
        .filter(([, group]) => group.length === 2)
        .map(([id, group]) => ({
            id,
            tabs: group.sort((a, b) => a.index - b.index) as [chrome.tabs.Tab, chrome.tabs.Tab],
        }))
        .sort((a, b) => a.tabs[0].index - b.tabs[0].index);
}

export function normalizeUrl(input: string): string | undefined {
    const value = input.trim();
    if (!value) return undefined;
    const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;
    let parsed: URL;
    try {
        parsed = new URL(candidate);
    } catch {
        throw new Error('errorUrl');
    }
    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname || /\s/.test(value)) {
        throw new Error('errorUrl');
    }
    return parsed.href;
}

async function freshTab(id: number): Promise<chrome.tabs.Tab> {
    try {
        return await chrome.tabs.get(id);
    } catch {
        throw new Error('errorMissingTab');
    }
}

function assertAvailable(tab: chrome.tabs.Tab): void {
    if (tab.id === undefined) throw new Error('errorMissingTab');
    if (isSplit(tab)) throw new Error('errorAlreadySplit');
}

export async function createWithNew(tabId: number, rawUrl: string, side: Side): Promise<void> {
    if (typeof api().createSplit !== 'function') throw new Error('errorVersion');
    const url = normalizeUrl(rawUrl);
    const base = await freshTab(tabId);
    assertAvailable(base);
    const properties: chrome.tabs.CreateProperties & { splitWithTabId: number } = {
        splitWithTabId: tabId,
        windowId: base.windowId,
        pinned: base.pinned,
        active: true,
        ...(side === 'left' ? { index: base.index } : {}),
        ...(url ? { url } : {}),
    };
    await chrome.tabs.create(properties);
}

export async function pairExisting(baseId: number, targetId: number, side: Side): Promise<void> {
    if (typeof api().createSplit !== 'function') throw new Error('errorVersion');
    const [base, target] = await Promise.all([freshTab(baseId), freshTab(targetId)]);
    assertAvailable(base);
    assertAvailable(target);
    if (!isCompatible(base, target)) throw new Error('errorIncompatible');
    const originalIndex = target.index;
    const baseIndexAfterRemoval = base.index - Number(target.index < base.index);
    const destination = baseIndexAfterRemoval + Number(side === 'right');
    const moved = target.index !== destination;
    if (moved) await chrome.tabs.move(targetId, { index: destination });
    try {
        const [freshBase, freshTarget] = await Promise.all([freshTab(baseId), freshTab(targetId)]);
        if (!isCompatible(freshBase, freshTarget) || Math.abs(freshBase.index - freshTarget.index) !== 1) {
            throw new Error('errorIncompatible');
        }
        const ordered: [number, number] = freshBase.index < freshTarget.index
            ? [baseId, targetId]
            : [targetId, baseId];
        await api().createSplit(ordered);
    } catch (error) {
        if (moved) {
            try {
                const current = await chrome.tabs.get(targetId);
                if (!isSplit(current)) await chrome.tabs.move(targetId, { index: originalIndex });
            } catch { /* The tab may have closed while the operation was running. */ }
        }
        throw error;
    }
}

export async function separate(splitViewId: number): Promise<void> {
    if (typeof api().unsplit !== 'function') throw new Error('errorVersion');
    await api().unsplit(splitViewId);
}
