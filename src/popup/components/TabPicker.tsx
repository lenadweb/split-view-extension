import { Check } from 'lucide-react';
import { t } from '../../shared/i18n';
import { isCompatible } from '../../shared/split';
import { titleOf } from '../tabText';

type Props = {
    current: chrome.tabs.Tab;
    tabs: chrome.tabs.Tab[];
    selectedId?: number;
    onSelect: (tabId: number) => void;
};

export default function TabPicker({
    current,
    tabs,
    selectedId,
    onSelect,
}: Props) {
    const compatible = tabs.filter((tab) => isCompatible(current, tab));

    return (
        <div className="tab-picker">
            <p className="field-label">{t('chooseTabShort')}</p>
            {compatible.length > 0 ? (
                <div className="candidate-list">
                    {compatible.map((tab) => (
                        <button
                            type="button"
                            className="candidate"
                            key={tab.id}
                            aria-pressed={selectedId === tab.id}
                            onClick={() => onSelect(tab.id!)}
                        >
                            <div className="candidate-copy">
                                <strong title={titleOf(tab)}>
                                    {titleOf(tab)}
                                </strong>
                            </div>
                            <span
                                className={`selection-mark ${selectedId === tab.id ? 'selected' : ''}`}
                                aria-hidden="true"
                            >
                                {selectedId === tab.id && (
                                    <Check size={15} strokeWidth={2.6} />
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="no-candidates">
                    <p>{t('noTabs')}</p>
                </div>
            )}
        </div>
    );
}
