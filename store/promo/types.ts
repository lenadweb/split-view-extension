export enum ArtworkKind {
    Screenshot = 'screenshot',
    Marquee = 'marquee',
    SmallTile = 'small-tile',
}

export enum ShotId {
    New = '1',
    Existing = '2',
    Pairs = '3',
}

export type Target = {
    id: string;
    file: string;
    width: number;
    height: number;
};

export type ScreenshotCopy = {
    label: string;
    title: [string, string];
    description: string;
};
