import type {Activity} from "@src/editor/type/activity";
import type {ActivityAction, ActivityTarget} from "@src/editor/enum";

export type ImageCreateActivity = Activity<
	ActivityTarget.Image,
	ActivityAction.Create,
	{
		parentId: number;
		tiled: boolean;
		draft: {
			name: string;
			x: number;
			y: number;
			width: number;
			height: number;
			rotation: number;
			scaleX: number;
			scaleY: number;
			pivotX: number;
			pivotY: number;
			file?: File;
		};
	}
>;