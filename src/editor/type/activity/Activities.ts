import type {
	EntityCreateActivity,
	ImageCreateActivity,
	MarkerCreateActivity,
	ProjectExploreActivity,
	ProjectInitActivity,
	SystemActivity,
} from "@src/editor/type/activity";

export type Activities = SystemActivity
	| ProjectExploreActivity
	| ProjectInitActivity
	| EntityCreateActivity
	| ImageCreateActivity
	| MarkerCreateActivity;