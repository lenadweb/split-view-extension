# Chrome Web Store permissions and privacy

## Single purpose

Create, display, focus, and separate Chrome's native Split View pairs in the current window. The user can pair the current tab with a new or existing tab and open a link beside a tab from its context menu.

## `tabs`

The popup queries tabs in the current window to show their titles, find existing Split View pairs through `splitViewId`, check whether tabs can be paired, and focus a chosen pair. The extension creates, moves, pairs, and separates tabs only after a user action. The permission makes titles available for the picker. The extension does not store or transmit tab titles or URLs.

## `contextMenus`

Adds commands to tab and link context menus for opening a new tab or the selected link in Split View. The link URL is used only to navigate the new tab after the user selects that command.

## Host permissions

None. The extension has no content scripts and does not read or change page content.

## Data usage

The extension has no account, backend, analytics, advertising, or storage. Tab titles, Split View IDs, and the selected context-menu link are processed locally in memory to perform the requested action. Nothing is collected or sent to the developer or another service.

## Remote code

None. All executable code is packaged with the extension.
