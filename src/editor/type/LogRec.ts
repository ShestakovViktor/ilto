import type {LogKind} from "@src/editor/enum";

export type LogRec = {
	kind: LogKind;
	time: string;
	stamp: number;
	source: string;
	status: "success" | "failed";
	message: string;
	payload?: Record<string, unknown>;
	error?: Record<string, unknown>;
	log?: LogRec[];
};