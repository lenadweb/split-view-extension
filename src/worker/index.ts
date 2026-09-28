import { createWithNew, Side } from '../shared/split';
import { t } from '../shared/i18n';

const items: { id: string; title: string; contexts: chrome.contextMenus.ContextType[] }[] = [
    { id: 'link-right', title: 'contextLinkRight', contexts: ['link'] },
    { id: 'link-left', title: 'contextLinkLeft', contexts: ['link'] },
    { id: 'tab-right', title: 'contextTabRight', contexts: ['tab'] },
    { id: 'tab-left', title: 'contextTabLeft', contexts: ['tab'] },
];

async function registerMenus(): Promise<void> {
    await chrome.contextMenus.removeAll();
    for (const item of items) {
        chrome.contextMenus.create({ id: item.id, title: t(item.title), contexts: item.contexts });
    }
}

chrome.runtime.onInstalled.addListener(() => { void registerMenus(); });
chrome.runtime.onStartup.addListener(() => { void registerMenus(); });

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (tab?.id === undefined) return;
    const side: Side = info.menuItemId.toString().endsWith('left') ? 'left' : 'right';
    const url = info.menuItemId.toString().startsWith('link-') ? info.linkUrl ?? '' : '';
    void createWithNew(tab.id, url, side).catch((error: unknown) => {
        console.error('Split View context menu action failed:', error);
    });
});
