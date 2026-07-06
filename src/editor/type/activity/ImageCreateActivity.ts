import type {Activity} from "@src/editor/type/activity";
import type {ActivityKind} from "@src/editor/enum";

export type ImageCreateActivity = Activity<
	ActivityKind.ImageCreate,
	{
		x: number;
		y: number;
		width: number;
		height: number;
		file: File | undefined;
	}
>;