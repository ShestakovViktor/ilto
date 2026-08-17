import {Action} from "@src/core/library";
import type {Stats} from "@src/core/type";

export class RevisionBumpAction extends Action<void> {
	name = "RevisionBumpAction";

	constructor(private stats: Stats) {
		super();
	}

	exec(): void {
		this.stats.revision++;
	}

	undo(): void {
		this.stats.revision--;
	}
}