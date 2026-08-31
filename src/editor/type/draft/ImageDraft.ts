import type {Pivot, Rotation, Size, Spatial} from "@src/storage/type/property";
import type {ActivityTarget} from "@src/editor/enum";
import type {Draft} from "@src/editor/type/draft";

export type ImageDraft = Draft
	& Spatial
	& Size
	& Rotation
	& Pivot
	& {
		target: ActivityTarget.Image;
		parentId: number;
		file: File | undefined;
	};

