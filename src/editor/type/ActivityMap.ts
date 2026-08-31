import type {ActivityTarget, ActivityAction} from "@src/editor/enum";

export type ActivityMap<U>
	= Partial<
		Record<
			ActivityTarget,
			Partial<
				Record<
					ActivityAction,
					U
				>
			>
		>
	>;