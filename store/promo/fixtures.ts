import { ShotId } from './types';

type Messages = Record<string, { message: string }>;

function tab(
    id: number,
    index: number,
    title: string,
    active = false,
    splitViewId = -1
): chrome.tabs.Tab {
    return {
        id,
        index,
        title,
        active,
        splitViewId,
        windowId: 1,
        groupId: -1,
        pinned: false,
    } as chrome.tabs.Tab;
}

function scenario(shot: ShotId): chrome.tabs.Tab[] {
    const titles = [
        'Design review',
        'Project brief',
        'Research notes',
        'Release checklist',
    ];
    const paired = shot === ShotId.Pairs;
    return titles
        .slice(0, shot === ShotId.New ? 3 : 4)
        .map((title, index) =>
            tab(
                index + 1,
                index,
                title,
                index === 0,
                paired ? (index < 2 ? 41 : 42) : -1
            )
        );
}

export async function installChromeStub(shot: ShotId) {
    const response = await fetch('/_locales/en/messages.json');
    if (!response.ok) throw new Error('English messages unavailable');
    const messages = (await response.json()) as Messages;
    const tabs = scenario(shot);
    const event = {
        addListener: () => undefined,
        removeListener: () => undefined,
    };

    (globalThis as { chrome: typeof chrome }).chrome = {
        i18n: {
            getMessage: (key: string) => messages[key]?.message ?? '',
        },
        tabs: {
            query: async () => tabs,
            get: async (id: number) => tabs.find((item) => item.id === id),
            onCreated: event,
            onRemoved: event,
            onMoved: event,
            onUpdated: event,
            onActivated: event,
            onAttached: event,
            onDetached: event,
        },
    } as unknown as typeof chrome;
}
