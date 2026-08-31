import type {ActivityTarget} from "@src/editor/enum";
import type {Draft} from "@src/editor/type/draft";

export type VoidDraft = Draft & {
	target: ActivityTarget.Void;
};