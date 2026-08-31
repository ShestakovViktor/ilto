import type {Activity} from "@src/editor/type/activity";
import type {ActivityAction, ActivityTarget} from "@src/editor/enum";

export type SystemActivity = Activity<
	ActivityTarget.System,
	ActivityAction.Setup
>;