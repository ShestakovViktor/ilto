import type {Activity} from "@src/editor/type/activity";
import type {ActivityAction, ActivityTarget} from "@src/editor/enum";

export type ImageCreateActivity = Activity<
	ActivityTarget.Image,
	ActivityAction.Create
>;