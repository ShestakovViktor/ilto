import type {ActivityAction, ActivityTarget} from "@src/editor/enum";

export type Activity<
	T extends ActivityTarget,
	A extends ActivityAction,
	P extends Record<string, unknown> = never,
> = {
	target: T;
	action: A;
} & ([P] extends [never]
	? {payload?: never}
	: {payload: P}
);