import { ShotId } from './types';
import type { ScreenshotCopy } from './types';

export const SCREENSHOT_COPY: Record<ShotId, ScreenshotCopy> = {
    [ShotId.New]: {
        label: '01 / 03',
        title: ['Two tabs.', 'One view.'],
        description: 'Open a new tab beside the one you are using.',
    },
    [ShotId.Existing]: {
        label: '02 / 03',
        title: ['Bring tabs', 'together.'],
        description: 'Choose an open tab and place it on either side.',
    },
    [ShotId.Pairs]: {
        label: '03 / 03',
        title: ['All pairs.', 'One place.'],
        description: 'Open or separate pairs without closing tabs.',
    },
};
