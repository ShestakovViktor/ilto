import type {Activity} from "@src/editor/type/activity";
import type {ActivityAction, ActivityTarget} from "@src/editor/enum";

export type EntityCreateActivity = Activity<
	ActivityTarget.Entity,
	ActivityAction.Create
>;