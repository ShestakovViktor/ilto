import type {Session} from "@src/editor/type";
import {Action} from "@src/shared/controller";
import type {AdornerManager} from "@src/viewer/adorner";

export class SessionSyncAdornersAction extends Action<void> {
	name = "SessionSyncAdornersAction";

	constructor(
		private session: Session,
		private adorner: AdornerManager
	) {
		super();
	}

	exec(): void {
		this.adorner.update(Object.values(this.session.adorner));
	}

	undo(): void {
		this.exec();
	}
}