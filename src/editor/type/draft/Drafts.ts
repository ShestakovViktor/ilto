import type {
	ImageDraft,
	MarkerDraft,
	ProjectDraft,
	VoidDraft,
} from "@src/editor/type/draft";

export type Drafts = VoidDraft
	| ProjectDraft
	| ImageDraft
	| MarkerDraft;