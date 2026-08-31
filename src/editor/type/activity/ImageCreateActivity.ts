import type {ImageDraft} from "@src/editor/type/draft";
import type {Activity} from "@src/editor/type/activity";
import {ActivityAction, ActivityTarget} from "@src/editor/enum";

export type ImageCreateActivity = Activity<
	ActivityTarget.Image,
	ActivityAction.Create,
	{
		file: File | undefined;
		parentId: number;
		isTiled: boolean;
	} & ImageDraft
>;

export function isImageCreateActivity(
	activity: Record<string, unknown> | undefined
): activity is ImageCreateActivity {
	return typeof activity == "object"
	&& activity.target == ActivityTarget.Image
	&& activity.action == ActivityAction.Create;
}