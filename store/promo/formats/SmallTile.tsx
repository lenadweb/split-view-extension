import Brand from '../components/Brand';
import BrandSymbol from '../components/BrandSymbol';

export default function SmallTile() {
    return (
        <div className="promo-canvas promo-canvas--tile">
            <Brand />
            <h1>
                Two tabs.
                <br />
                <span>One view.</span>
            </h1>
            <BrandSymbol size="small" />
        </div>
    );
}
