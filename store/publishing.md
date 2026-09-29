# Chrome Web Store publishing

The extension name and summary come from `public/_locales/en/messages.json`. Use the text under **Description** in `store/description.md` for the English detailed description. Keep the listing language set to English and choose **Functionality & UI** as the category.

## Assets

- Store icon: `public/icons/128.png`
- Screenshots, in order: `store/assets/screenshot-1.png`, `screenshot-2.png`, `screenshot-3.png`
- Small promo tile: `store/assets/small-tile.png`
- Marquee promo tile: `store/assets/marquee.png`

## Dashboard settings

- Set visibility to **Public** and distribution to **All regions**.
- Complete the Privacy tab using `store/permissions.md` and the extension's actual data practices.
- Add a homepage and support URL when the public open source repository and support page are available. Verify an official publisher site if you own one.
- After publishing, review impressions, installs, uninstalls, and country and language breakdowns in the Store dashboard. Use those results to decide whether additional listing languages are worthwhile.

Chrome Web Store guidance: [listing quality](https://developer.chrome.com/docs/webstore/best-listing), [category](https://developer.chrome.com/docs/webstore/best-practices), [distribution](https://developer.chrome.com/docs/webstore/cws-dashboard-distribution), [metrics](https://developer.chrome.com/docs/webstore/metrics).
