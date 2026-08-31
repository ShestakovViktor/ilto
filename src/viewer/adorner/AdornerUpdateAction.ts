import {Action} from "@src/shared/controller";
import type {Adorner, AdornerManager} from "@src/viewer/adorner";

export class AdornerUpdateAction extends Action<void> {
	name = "AdornerUpdateAction";

	constructor(
		private adorner: AdornerManager,
		public payload: {adorners: Adorner[]}
	) {
		super();
	}

	apply(): void {
		this.adorner.update(this.payload.adorners);
	}

	revert(): void {
	}
}