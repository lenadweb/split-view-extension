import Brand from '../components/Brand';
import PopupPreview from '../components/PopupPreview';
import { SCREENSHOT_COPY } from '../copy';
import { ShotId } from '../types';

type Props = {
    shot: ShotId;
};

export default function Screenshot({ shot }: Props) {
    const copy = SCREENSHOT_COPY[shot];

    return (
        <div
            className={`promo-canvas promo-canvas--screenshot promo-canvas--shot-${shot}`}
        >
            <div className="screenshot-copy">
                <Brand />
                <div className="screenshot-message">
                    <p className="promo-eyebrow">{copy.label}</p>
                    <h1>
                        {copy.title[0]}
                        <br />
                        <span>{copy.title[1]}</span>
                    </h1>
                    <p className="promo-description">{copy.description}</p>
                </div>
                <p className="screenshot-footnote">
                    Native Chrome Split View · Chrome 155+
                </p>
            </div>
            <PopupPreview />
        </div>
    );
}
