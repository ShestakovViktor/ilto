import {type ActionEngine, InputMode} from "@src/editor/controller";
import type {Session} from "@src/editor/type";
import type {Viewer} from "@src/viewer/Viewer";
import {DraftParentChangeScript, DraftPositionSetScript} from "@src/editor/script";
import {DraftParentSetAction} from "@src/editor/action/draft";

export class EntityCreateMode extends InputMode {
	constructor(
		private viewer: Viewer,
		private engine: ActionEngine,
		private session: Session
	) {
		super();
	}

	async ImageCreate(): Promise<void> {
		if (!draft.value.file) {
			throw new Error();
		}
		else if (!draft.value.width || !draft.value.height) {
			const size = await engine.exec(
				new ImageMeasureAction({file: draft.value.file})
			);
			draft.value.width = size.width;
			draft.value.height = size.height;
		}

		const data = {
			name: "",
			x: draft.value.x,
			y: draft.value.y,
			width: draft.value.width,
			height: draft.value.height,
			rotation: 0,
			scaleX: 1,
			scaleY: 1,
			pivotX: draft.value.pivotX,
			pivotY: draft.value.pivotY,
			file: draft.value.file,
			parentId: payload.value.parentId,
		};

		if (!isTiled.value) {
			await engine.exec(new ImageCreateSingleScript(
				repo,
				stats,
				graphics,
				data
			));
		}
		else {
			await engine.exec(new ImageCreateTiledScript(
				repo,
				stats,
				graphics,
				data
			));
		}

		await engine.exec(new SceneUpdateAction(viewer));

		await engine.exec(new ActivitySetAction(
			session, {activity: {
				target: ActivityTarget.Entity,
				action: ActivityAction.Create,
			}}
		));
	}

	async foo(x: number, y: number): Promise<void> {

		if (
			"parentId" in this.session.draft
			&& "x" in this.session.draft
			&& "y" in this.session.draft
		) {
			await this.engine.exec(
				new DraftPositionSetScript(
					this.viewer,
					this.session,
					{x, y}
				)
			);

			await this.engine.exec(
				new DraftParentChangeScript(
					this.viewer,
					this.session,
					{id: this.session.draft.parentId}
				)
			);
		}
	}

	onMouseDown(event: MouseEvent): void {
		const rect = (event.currentTarget as HTMLDivElement)
			.getBoundingClientRect();

		const x = Math.floor((event.x - rect.x - this.viewer.view.x)
            / this.viewer.view.s);
		const y = Math.floor((event.y - rect.y - this.viewer.view.y)
            / this.viewer.view.s);

		void this.foo(x, y);

		event.preventDefault();
	}

	onMouseMove(): void {}

	onMouseUp(): void {}
}