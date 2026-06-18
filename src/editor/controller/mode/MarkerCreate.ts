import {Engine, Mode} from "@src/editor/controller";
import {Session} from "@src/editor/type";
// import {CreateImageAction} from "@src/editor/action";
import {Storage} from "@src/storage/controller";
import {ViewerState} from "@src/viewer/type";
import {SetStoreFunction} from "solid-js/store";

export class MarkerCreate extends Mode {
	constructor(
		private viewer: ViewerState,
		private session: Session,
		private setSession: SetStoreFunction<Session>,
		private engine: Engine,
		private storage: Storage

	) {
		super();
	}

	onMouseDown(event: MouseEvent): void {
		console.log(event);
		// const rect = (event.currentTarget as HTMLDivElement)
		//     .getBoundingClientRect();

		// const x = Math.floor((event.x - rect.x)
		//     / this.viewer.scale);
		// const y = Math.floor((event.y - rect.y)
		//     / this.viewer.scale);

		// const marker = this.actionManager.execute(
		//     new CreateImageAction(
		//         this.storage,
		//         this.session,
		//         this.setSession,
		//         x,
		//         y
		//     )
		// );

		// this.setSession({
		//     selected: marker,
		// });

		// event.preventDefault();
	}

	onMouseMove(): void {}

	onMouseUp(): void {}
}