import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ArrowRight, Columns2, ExternalLink, Link2, PanelLeft, PanelRight,
    Plus, RefreshCw, Search, Unlink2, X,
} from 'lucide-react';
import { t } from '../shared/i18n';
import {
    createWithNew, getPairs, isCompatible, isSplit, pairExisting,
    separate, Side, splitId,
} from '../shared/split';

type Mode = 'new' | 'existing';

const titleOf = (tab: chrome.tabs.Tab): string => tab.title?.trim() || t('tabUntitled');
const hostOf = (tab: chrome.tabs.Tab): string => {
    const raw = tab.url || tab.pendingUrl;
    if (!raw) return '';
    try {
        const url = new URL(raw);
        return url.protocol === 'http:' || url.protocol === 'https:'
            ? url.hostname.replace(/^www\./, '')
            : url.protocol.replace(':', '');
    } catch {
        return '';
    }
};

const errorText = (error: unknown): string => {
    if (error instanceof Error && error.message.startsWith('error')) return t(error.message);
    return t('errorGeneric');
};

export default function App() {
    const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<Mode>('new');
    const [side, setSide] = useState<Side>('right');
    const [url, setUrl] = useState('');
    const [search, setSearch] = useState('');
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const refresh = useCallback(async () => {
        try {
            const result = await chrome.tabs.query({ currentWindow: true });
            setTabs(result.sort((a, b) => a.index - b.index));
            setError('');
        } catch (cause) {
            setError(errorText(cause));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
        const schedule = () => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => { void refresh(); }, 100);
        };
        chrome.tabs.onCreated.addListener(schedule);
        chrome.tabs.onRemoved.addListener(schedule);
        chrome.tabs.onMoved.addListener(schedule);
        chrome.tabs.onUpdated.addListener(schedule);
        chrome.tabs.onActivated.addListener(schedule);
        chrome.tabs.onAttached.addListener(schedule);
        chrome.tabs.onDetached.addListener(schedule);
        return () => {
            if (timer.current) clearTimeout(timer.current);
            chrome.tabs.onCreated.removeListener(schedule);
            chrome.tabs.onRemoved.removeListener(schedule);
            chrome.tabs.onMoved.removeListener(schedule);
            chrome.tabs.onUpdated.removeListener(schedule);
            chrome.tabs.onActivated.removeListener(schedule);
            chrome.tabs.onAttached.removeListener(schedule);
            chrome.tabs.onDetached.removeListener(schedule);
        };
    }, [refresh]);

    const current = tabs.find((tab) => tab.active);
    const pairs = useMemo(() => getPairs(tabs), [tabs]);
    const partner = current && isSplit(current)
        ? tabs.find((tab) => tab.id !== current.id && splitId(tab) === splitId(current))
        : undefined;
    const candidates = useMemo(() => current
        ? tabs.filter((tab) => isCompatible(current, tab) &&
            `${titleOf(tab)} ${hostOf(tab)}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
        : [], [current, search, tabs]);

    const run = async (action: () => Promise<void>) => {
        setBusy(true);
        setError('');
        try {
            await action();
            await refresh();
        } catch (cause) {
            setError(errorText(cause));
            await refresh();
            setError(errorText(cause));
        } finally {
            setBusy(false);
        }
    };

    return (
        <main className="app-shell">
            <header className="app-header">
                <div className="brand-mark" aria-hidden="true"><span /><span /></div>
                <div className="brand-copy">
                    <h1>Split View</h1>
                    <p>{t('tagline')}</p>
                </div>
                <span className="version-pill">155+</span>
            </header>

            {error && (
                <div className="error-notice" role="alert">
                    <div><strong>{t('errorTitle')}</strong><p>{error}</p></div>
                    <button type="button" className="icon-button" onClick={() => setError('')} aria-label="Close"><X size={16} /></button>
                </div>
            )}

            {loading ? (
                <div className="loading-block" aria-live="polite">{t('working')}</div>
            ) : !current || current.id === undefined ? (
                <div className="empty-primary"><p>{t('errorMissingTab')}</p><button type="button" className="secondary-button" onClick={() => { void refresh(); }}><RefreshCw size={15} />{t('retry')}</button></div>
            ) : (
                <>
                    <section className="current-panel" aria-labelledby="current-heading">
                        <div className="eyebrow-row"><span id="current-heading" className="eyebrow">{t('currentTab')}</span><span className={`status ${isSplit(current) ? 'status-active' : ''}`}><span className="status-dot" />{t(isSplit(current) ? 'splitActive' : 'readyToSplit')}</span></div>
                        <div className="current-main"><div className="tab-glyph" aria-hidden="true"><Columns2 size={20} strokeWidth={1.8} /></div><div className="tab-copy"><strong title={titleOf(current)}>{titleOf(current)}</strong><span>{hostOf(current)}</span></div></div>
                        {partner && <div className="partner-line"><Link2 size={14} /><span>{t('pairedWith')}</span><strong title={titleOf(partner)}>{titleOf(partner)}</strong></div>}
                        {isSplit(current) && <button type="button" className="separate-button" disabled={busy} onClick={() => { void run(() => separate(splitId(current))); }}><Unlink2 size={16} />{t('unsplit')}</button>}
                    </section>

                    {!isSplit(current) && (
                        <section className="composer" aria-label="Create Split View">
                            <div className="mode-switch" role="tablist" aria-label="Split method">
                                <button type="button" role="tab" aria-selected={mode === 'new'} className={mode === 'new' ? 'selected' : ''} onClick={() => setMode('new')}><Plus size={16} />{t('newTab')}</button>
                                <button type="button" role="tab" aria-selected={mode === 'existing'} className={mode === 'existing' ? 'selected' : ''} onClick={() => setMode('existing')}><Columns2 size={16} />{t('openTabs')}</button>
                            </div>

                            <div className="side-row"><span className="field-label">{t('sideLabel')}</span><div className="side-switch" role="group" aria-label={t('sideLabel')}><button type="button" aria-pressed={side === 'left'} className={side === 'left' ? 'selected' : ''} onClick={() => setSide('left')}><PanelLeft size={15} />{t('left')}</button><button type="button" aria-pressed={side === 'right'} className={side === 'right' ? 'selected' : ''} onClick={() => setSide('right')}><PanelRight size={15} />{t('right')}</button></div></div>

                            {mode === 'new' ? (
                                <form onSubmit={(event) => { event.preventDefault(); void run(() => createWithNew(current.id!, url, side)); }}>
                                    <label className="field-label url-label" htmlFor="url-input">{t('urlLabel')}</label>
                                    <div className="input-wrap"><Link2 size={17} aria-hidden="true" /><input id="url-input" type="text" inputMode="url" autoComplete="url" spellCheck={false} placeholder={t('urlPlaceholder')} value={url} onChange={(event) => setUrl(event.target.value)} /></div>
                                    <p className="field-hint">{t('urlHint')}</p>
                                    <button type="submit" className="primary-button" disabled={busy}>{busy ? t('working') : t('createSplit')}<ArrowRight size={17} /></button>
                                </form>
                            ) : (
                                <div className="existing-panel">
                                    <p className="section-hint">{t('chooseTab')}</p>
                                    <div className="input-wrap search-wrap"><Search size={17} aria-hidden="true" /><input type="search" aria-label={t('searchTabs')} placeholder={t('searchTabs')} value={search} onChange={(event) => setSearch(event.target.value)} /></div>
                                    {candidates.length ? <div className="candidate-list">{candidates.map((tab) => <div className="candidate" key={tab.id}><div className="candidate-icon" aria-hidden="true">{titleOf(tab).charAt(0).toUpperCase()}</div><div className="candidate-copy"><strong title={titleOf(tab)}>{titleOf(tab)}</strong><span>{hostOf(tab)}</span></div><button type="button" className="pair-button" disabled={busy} onClick={() => { void run(() => pairExisting(current.id!, tab.id!, side)); }} aria-label={`${t('pair')}: ${titleOf(tab)}`} title={t('pair')}><ArrowRight size={17} /></button></div>)}</div> : <div className="no-candidates"><strong>{t('noTabs')}</strong><p>{t('noTabsHint')}</p></div>}
                                    {candidates.length > 0 && <p className="move-hint">{t('willMove')}</p>}
                                </div>
                            )}
                        </section>
                    )}

                    <section className="pairs-section" aria-labelledby="pairs-heading"><div className="section-head"><h2 id="pairs-heading" className="eyebrow">{t('activePairs')}</h2><span>{pairs.length}</span></div>{pairs.length ? <div className="pair-list">{pairs.map((pair) => <div className="pair-card" key={pair.id}><div className="pair-mini" aria-hidden="true"><span /><span /></div><div className="pair-copy"><strong title={titleOf(pair.tabs[0])}>{titleOf(pair.tabs[0])}</strong><span title={titleOf(pair.tabs[1])}>{titleOf(pair.tabs[1])}</span></div><div className="pair-actions"><button type="button" className="icon-button" onClick={() => { void run(async () => { await chrome.tabs.update(pair.tabs[0].id!, { active: true }); }); }} title={t('focusPair')} aria-label={t('focusPair')}><ExternalLink size={16} /></button><button type="button" className="icon-button" disabled={busy} onClick={() => { void run(() => separate(pair.id)); }} title={t('unsplit')} aria-label={t('unsplit')}><Unlink2 size={16} /></button></div></div>)}</div> : <p className="pairs-empty">{t('noPairs')}</p>}</section>
                </>
            )}
            <footer>{t('about')}</footer>
        </main>
    );
}
