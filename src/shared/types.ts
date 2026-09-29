export enum SplitSide {
    Left = 'left',
    Right = 'right',
}

export enum SplitErrorCode {
    Url = 'errorUrl',
    MissingTab = 'errorMissingTab',
    AlreadySplit = 'errorAlreadySplit',
    Incompatible = 'errorIncompatible',
    Version = 'errorVersion',
}

export type SplitPair = {
    id: number;
    tabs: [chrome.tabs.Tab, chrome.tabs.Tab];
};
