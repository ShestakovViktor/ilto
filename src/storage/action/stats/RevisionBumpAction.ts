import {Action} from "@src/shared/controller";
import type {Stats} from "@src/storage/type";

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