import type {Activity} from "@src/editor/type/activity";
import {ActivityAction, ActivityTarget} from "@src/editor/enum";

export type ProjectInitActivity = Activity<
	ActivityTarget.Project,
	ActivityAction.Init,
	{
		name: string;
		width: number;
		height: number;
	}
>;

export function isProjectInitActivity(
	activity: Record<string, unknown> | undefined
): activity is ProjectInitActivity {
	return typeof activity === "object"
		&& activity.target === ActivityTarget.Project
		&& activity.action === ActivityAction.Init;
}