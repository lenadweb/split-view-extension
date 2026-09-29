import Brand from '../components/Brand';
import BrandSymbol from '../components/BrandSymbol';

export default function Marquee() {
    return (
        <div className="promo-canvas promo-canvas--marquee">
            <div className="marquee-copy">
                <Brand />
                <h1>
                    Two tabs.
                    <br />
                    <span>One view.</span>
                </h1>
                <p>Native Split View for Chrome.</p>
            </div>
            <BrandSymbol size="large" />
        </div>
    );
}
