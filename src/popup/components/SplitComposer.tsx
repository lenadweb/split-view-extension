import { useState } from 'react';
import { Columns2, Plus } from 'lucide-react';
import { t } from '../../shared/i18n';
import { SplitSide } from '../../shared/types';
import { isCompatible } from '../../shared/split';
import { SplitMode } from '../types';
import TabPicker from './TabPicker';
import SideSelector from './SideSelector';

type Props = {
    current: chrome.tabs.Tab;
    tabs: chrome.tabs.Tab[];
    busy: boolean;
    onNew: (side: SplitSide) => void;
    onPair: (tabId: number, side: SplitSide) => void;
};

export default function SplitComposer({
    current,
    tabs,
    busy,
    onNew,
    onPair,
}: Props) {
    const [mode, setMode] = useState(SplitMode.New);
    const [side, setSide] = useState(SplitSide.Right);
    const [selectedId, setSelectedId] = useState<number>();
    const selectedTab = tabs.find(
        (tab) => tab.id === selectedId && isCompatible(current, tab)
    );
    const canSubmit = mode === SplitMode.New || selectedTab !== undefined;

    function submit(event: React.FormEvent) {
        event.preventDefault();
        if (mode === SplitMode.New) onNew(side);
        if (mode === SplitMode.Existing && selectedTab?.id !== undefined)
            onPair(selectedTab.id, side);
    }

    return (
        <section className="composer" aria-label={t('createSplit')}>
            <div
                className="mode-switch"
                role="group"
                aria-label={t('splitMethod')}
            >
                <button
                    type="button"
                    aria-pressed={mode === SplitMode.New}
                    className={mode === SplitMode.New ? 'selected' : ''}
                    onClick={() => setMode(SplitMode.New)}
                >
                    <Plus size={18} />
                    {t('newTab')}
                </button>
                <button
                    type="button"
                    aria-pressed={mode === SplitMode.Existing}
                    className={mode === SplitMode.Existing ? 'selected' : ''}
                    onClick={() => setMode(SplitMode.Existing)}
                >
                    <Columns2 size={18} />
                    {t('openTabs')}
                </button>
            </div>
            <form onSubmit={submit}>
                {mode === SplitMode.Existing && (
                    <TabPicker
                        current={current}
                        tabs={tabs}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />
                )}
                <SideSelector value={side} onChange={setSide} />
                <button
                    type="submit"
                    className="primary-button"
                    disabled={busy || !canSubmit}
                >
                    {busy
                        ? t('working')
                        : mode === SplitMode.New
                          ? t(
                                side === SplitSide.Left
                                    ? 'openLeft'
                                    : 'openRight'
                            )
                          : selectedTab === undefined
                            ? t('selectTab')
                            : t(
                                  side === SplitSide.Left
                                      ? 'pairLeft'
                                      : 'pairRight'
                              )}
                </button>
            </form>
        </section>
    );
}
