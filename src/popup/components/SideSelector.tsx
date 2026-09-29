import { t } from '../../shared/i18n';
import { SplitSide } from '../../shared/types';

type Props = {
    value: SplitSide;
    onChange: (side: SplitSide) => void;
};

export default function SideSelector({ value, onChange }: Props) {
    return (
        <div className="side-options" role="group" aria-label={t('sideLabel')}>
            {[SplitSide.Left, SplitSide.Right].map((side) => (
                <button
                    key={side}
                    type="button"
                    aria-pressed={value === side}
                    className={value === side ? 'selected' : ''}
                    onClick={() => onChange(side)}
                >
                    <span
                        className={`split-preview ${side}`}
                        aria-hidden="true"
                    >
                        <span />
                        <span />
                    </span>
                    <span>{t(side)}</span>
                </button>
            ))}
        </div>
    );
}
