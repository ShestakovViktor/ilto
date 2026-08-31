import type {ActivityAction, ActivityTarget} from "@src/editor/enum";

export type Activity<
	T extends ActivityTarget,
	A extends ActivityAction,
> = {
	target: T;
	action: A;
};