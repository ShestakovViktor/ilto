import {VIEWER_MODE} from "@src/viewer/enum";

export type ViewerState = {
    mode: typeof VIEWER_MODE[keyof typeof VIEWER_MODE];
    scale: number;
};