import type {Activity} from "@src/editor/type/activity";
import type {ActivityAction, ActivityTarget} from "@src/editor/enum";

export type MarkerCreateActivity = Activity<
	ActivityTarget.Marker,
	ActivityAction.Create
>;