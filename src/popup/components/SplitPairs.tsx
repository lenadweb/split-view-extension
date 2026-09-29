import { t } from '../../shared/i18n';
import type { SplitPair } from '../../shared/types';
import { titleOf } from '../tabText';

type Props = {
    pairs: SplitPair[];
    activeId?: number;
    busy: boolean;
    onFocus: (tabId: number) => void;
    onSeparate: (splitId: number) => void;
};

export default function SplitPairs({
    pairs,
    activeId,
    busy,
    onFocus,
    onSeparate,
}: Props) {
    if (!pairs.length) return null;
    const ordered = [...pairs].sort(
        (a, b) => Number(b.id === activeId) - Number(a.id === activeId)
    );

    return (
        <section className="pairs-section" aria-labelledby="pairs-heading">
            <h2 id="pairs-heading" className="section-label">
                {t('activePairs')}
            </h2>
            <div className="pair-list">
                {ordered.map((pair) => (
                    <div
                        className={
                            pair.id === activeId
                                ? 'pair-row active'
                                : 'pair-row'
                        }
                        key={pair.id}
                    >
                        <div className="pair-titles">
                            <strong title={titleOf(pair.tabs[0])}>
                                {titleOf(pair.tabs[0])}
                            </strong>
                            <span title={titleOf(pair.tabs[1])}>
                                {titleOf(pair.tabs[1])}
                            </span>
                        </div>
                        <div className="pair-actions">
                            {pair.id !== activeId && (
                                <button
                                    type="button"
                                    className="pair-show"
                                    disabled={busy}
                                    onClick={() => onFocus(pair.tabs[0].id!)}
                                >
                                    {t('showPair')}
                                </button>
                            )}
                            <button
                                type="button"
                                className="pair-separate"
                                disabled={busy}
                                onClick={() => onSeparate(pair.id)}
                            >
                                {t('unsplitShort')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
