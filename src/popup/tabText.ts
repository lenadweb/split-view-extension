import { t } from '../shared/i18n';

export function titleOf(tab: chrome.tabs.Tab): string {
    return tab.title?.trim() || t('tabUntitled');
}
