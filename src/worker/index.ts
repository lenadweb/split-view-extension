import { t } from '../shared/i18n';
import { createWithNew } from '../shared/split';
import { SplitSide } from '../shared/types';
import { MENU_ITEMS, MenuId } from './menuItems';

async function registerMenus(): Promise<void> {
    await chrome.contextMenus.removeAll();
    for (const item of MENU_ITEMS) {
        chrome.contextMenus.create({
            id: item.id,
            title: t(item.title),
            contexts: item.contexts,
        });
    }
}

chrome.runtime.onInstalled.addListener(() => {
    void registerMenus();
});
chrome.runtime.onStartup.addListener(() => {
    void registerMenus();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (tab?.id === undefined) return;
    const id = info.menuItemId as MenuId;
    const side =
        id === MenuId.LinkLeft || id === MenuId.TabLeft
            ? SplitSide.Left
            : SplitSide.Right;
    const url =
        id === MenuId.LinkLeft || id === MenuId.LinkRight
            ? (info.linkUrl ?? '')
            : '';
    void createWithNew(tab.id, url, side).catch((error: unknown) => {
        console.error('Split View context menu action failed:', error);
    });
});
