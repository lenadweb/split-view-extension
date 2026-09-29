import { createRoot } from 'react-dom/client';
import App from 'src/popup/App';
import targets from './targets.json';
import { POPUP_ROOT_ID } from './components/PopupPreview';
import { installChromeStub } from './fixtures';
import Marquee from './formats/Marquee';
import Screenshot from './formats/Screenshot';
import SmallTile from './formats/SmallTile';
import { ArtworkKind, ShotId } from './types';
import './promo.css';

const params = new URLSearchParams(window.location.search);
const target =
    targets.find(({ id }) => id === params.get('asset')) ?? targets[0];
const parts = target.id.split('-');
const kind = target.id.startsWith('screenshot')
    ? ArtworkKind.Screenshot
    : target.id === 'marquee'
      ? ArtworkKind.Marquee
      : ArtworkKind.SmallTile;
const shot = Object.values(ShotId).find((id) => id === parts[1]) ?? ShotId.New;
const host = document.getElementById('promo');
if (!host) throw new Error('Promo root missing');
host.style.width = `${target.width}px`;
host.style.height = `${target.height}px`;

if (kind === ArtworkKind.Screenshot) {
    await installChromeStub(shot);
    createRoot(host).render(<Screenshot shot={shot} />);
    window.setTimeout(() => {
        const popup = document.getElementById(POPUP_ROOT_ID);
        if (!popup) throw new Error('Popup root missing');
        createRoot(popup).render(<App />);
        if (shot === ShotId.Existing) {
            window.setTimeout(() => {
                document
                    .querySelector<HTMLButtonElement>(
                        '.mode-switch button:nth-child(2)'
                    )
                    ?.click();
                window.setTimeout(() => {
                    document
                        .querySelector<HTMLButtonElement>('.candidate')
                        ?.click();
                }, 100);
            }, 100);
        }
    }, 100);
} else {
    createRoot(host).render(
        kind === ArtworkKind.Marquee ? <Marquee /> : <SmallTile />
    );
}
