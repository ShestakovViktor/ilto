import type {ViewerMode} from "@src/viewer/shared/enum";

export type ViewerState = {
	mode: typeof ViewerMode[keyof typeof ViewerMode];
	x: number;
	y: number;
	scale: number;
};

