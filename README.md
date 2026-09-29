# Split View

A small open source Chrome extension for the browser's native Split View. It places two tabs side by side in one window. Requires **Chrome 155 or newer**.

## What it does

- Open a new Chrome tab page beside the current tab, on the left or right.
- Pair the current tab with another open tab. If necessary, the extension moves it next to the current tab first.
- See every Split View pair in the current window, jump to a pair, or separate it without closing either tab.
- Right-click a link or tab to open a new Split View directly.
- English interface.

Chrome requires paired tabs to be adjacent and to have the same window, pinned state, and tab group. The picker shows only compatible tabs. The extension uses Chrome's own Split View; it does not resize windows or embed pages.

## Install locally

```sh
nvm use
npm install
npm run build
```

Open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select the `dist` folder. The production ZIP is written to `release/`.

## Development

```sh
npm run dev        # rebuild dist when files change
npm run typecheck
npm run lint
npm run build      # production build and ZIP
npm run promo      # Chrome Web Store images in store/assets
```

The popup is under `src/popup`: each panel has its own component, and tab updates live in `hooks/useWindowTabs.ts`. Split View operations are in `src/shared/split.ts`, with types and constants in separate files. The context menu is under `src/worker`. There are no backend services, accounts, analytics, or stored browsing data.

## Chrome Web Store

`store/description.md` contains the English listing. `store/permissions.md` contains the single-purpose and privacy answers. The generator renders the actual popup with sample tabs into `store/assets/`.

```sh
npm run promo                  # generate every image
npm run promo screenshot-1     # generate one image
npm run promo:dev              # preview at http://localhost:5199/?asset=screenshot-1
```

Store images and listing copy are in English. Set `CHROME_PATH` if Chrome is installed outside its usual location.

## Permissions

| Permission     | Reason                                                    |
| -------------- | --------------------------------------------------------- |
| `tabs`         | Display tab titles and manage tabs in the current window. |
| `contextMenus` | Add Split View actions to link and tab menus.             |

No host permissions are requested.

## API

The extension uses `chrome.tabs.create({ splitWithTabId })`, `chrome.tabs.createSplit()`, `chrome.tabs.unsplit()`, and `Tab.splitViewId`. See the [Chrome announcement](https://developer.chrome.com/blog/split-view-api-extensions?hl=en) and [Tabs API reference](https://developer.chrome.com/docs/extensions/reference/api/tabs).

## License

MIT. See [LICENSE](LICENSE).
