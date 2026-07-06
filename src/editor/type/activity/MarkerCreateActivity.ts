import type {Activity} from "@src/editor/type/activity";
import type {ActivityKind} from "@src/editor/enum";

export type MarkerCreateActivity = Activity<
	ActivityKind.MarkerCreate,
	{
		x: number;
		y: number;
		width: number;
		height: number;
		file: File | undefined;
	}
>;