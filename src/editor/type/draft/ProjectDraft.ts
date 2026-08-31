import type {ActivityTarget} from "@src/editor/enum";
import type {Draft} from "@src/editor/type/draft";

export type ProjectDraft = Draft & {
	target: ActivityTarget.Project;
	name: string;
};