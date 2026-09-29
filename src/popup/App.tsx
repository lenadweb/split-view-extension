import { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { t } from '../shared/i18n';
import {
    createWithNew,
    getPairs,
    isSplit,
    pairExisting,
    separate,
    splitId,
} from '../shared/split';
import { SplitErrorCode } from '../shared/types';
import Header from './components/Header';
import SplitComposer from './components/SplitComposer';
import SplitPairs from './components/SplitPairs';
import { useWindowTabs } from './hooks/useWindowTabs';

function messageFor(error: unknown): string {
    if (
        error instanceof Error &&
        Object.values(SplitErrorCode).includes(error.message as SplitErrorCode)
    )
        return t(error.message);
    return t('errorGeneric');
}

export default function App() {
    const { tabs, loading, loadError, refresh } = useWindowTabs();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const current = tabs.find((tab) => tab.active);
    const activeSplitId =
        current && isSplit(current) ? splitId(current) : undefined;
    const pairs = getPairs(tabs);

    async function run(action: () => Promise<void>) {
        setBusy(true);
        setError('');
        try {
            await action();
        } catch (cause) {
            setError(messageFor(cause));
        } finally {
            await refresh();
            setBusy(false);
        }
    }

    return (
        <main className="app-shell">
            <Header />
            {(error || loadError) && (
                <div className="error-notice" role="alert">
                    <div>
                        <strong>{t('errorTitle')}</strong>
                        <p>{error || t('errorGeneric')}</p>
                    </div>
                    <button
                        type="button"
                        className="icon-button"
                        onClick={() => {
                            setError('');
                            if (loadError) void refresh();
                        }}
                        aria-label={t(loadError ? 'retry' : 'close')}
                    >
                        {loadError ? <RefreshCw size={16} /> : <X size={16} />}
                    </button>
                </div>
            )}
            {loading ? (
                <div className="loading-block" aria-live="polite">
                    {t('working')}
                </div>
            ) : !current || current.id === undefined ? (
                <div className="empty-primary">
                    <p>{t('errorMissingTab')}</p>
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                            void refresh();
                        }}
                    >
                        <RefreshCw size={15} />
                        {t('retry')}
                    </button>
                </div>
            ) : (
                <>
                    {!isSplit(current) && (
                        <SplitComposer
                            current={current}
                            tabs={tabs}
                            busy={busy}
                            onNew={(side) => {
                                void run(() =>
                                    createWithNew(current.id!, '', side)
                                );
                            }}
                            onPair={(tabId, side) => {
                                void run(() =>
                                    pairExisting(current.id!, tabId, side)
                                );
                            }}
                        />
                    )}
                    <SplitPairs
                        pairs={pairs}
                        activeId={activeSplitId}
                        busy={busy}
                        onFocus={(tabId) => {
                            void run(async () => {
                                await chrome.tabs.update(tabId, {
                                    active: true,
                                });
                            });
                        }}
                        onSeparate={(id) => {
                            void run(() => separate(id));
                        }}
                    />
                </>
            )}
        </main>
    );
}
