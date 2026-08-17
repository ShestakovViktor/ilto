import type {ActivityKind} from "@src/editor/enum";

export type Activity<K extends ActivityKind, P = undefined> = {
	kind: K;
} & (P extends undefined
	? {payload?: never}
	: unknown extends P
		? {payload?: unknown}
		: {payload: P}
);