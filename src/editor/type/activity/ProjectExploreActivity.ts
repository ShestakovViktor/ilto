import type {Activity} from "@src/editor/type/activity";
import type {ActivityAction, ActivityTarget} from "@src/editor/enum";

export type ProjectExploreActivity = Activity<
	ActivityTarget.Project,
	ActivityAction.Explore
>;