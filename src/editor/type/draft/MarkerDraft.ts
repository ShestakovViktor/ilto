import type {Pivot, Rotation, Size, Spatial} from "@src/storage/type/property";
import type {ActivityTarget} from "@src/editor/enum";
import type {Draft} from "@src/editor/type/draft";

export type MarkerDraft = Draft
	& Spatial
	& Size
	& Rotation
	& Pivot
	& {
		target: ActivityTarget.Marker;
		parentId: number;
	};

