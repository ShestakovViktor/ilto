import type {
	EntityCreateActivity,
	ImageCreateActivity,
	ProjectExploreActivity,
	ProjectInitActivity,
	SystemActivity,
} from "@src/editor/type/activity";

export type Activities = SystemActivity
	| ProjectExploreActivity
	| ProjectInitActivity
	| EntityCreateActivity
	| ImageCreateActivity;