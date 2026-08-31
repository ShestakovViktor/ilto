import type {ActionEngine, InputMode} from "@src/editor/controller";
import {
	DefaultView,
	EntityCreateMode,
} from "@src/editor/controller/mode";
import type {ActivityMap, Session} from "@src/editor/type";
import type {Canvas, Loop, Scene, View} from "@src/viewer/shared/controller";
import {ActivityAction, ActivityTarget} from "@src/editor/enum";
import type {AdornerManager} from "@src/viewer/adorner";
import type {Viewer} from "@src/viewer/Viewer";

export class MouseController {
	private modes: ActivityMap<InputMode>;

	private target!: ActivityTarget;
	private action!: ActivityAction;

	private activeInputMode: InputMode;
	private defaultInputMode: DefaultView;

	constructor(
		private viewer: Viewer,
		private engine: ActionEngine,
		private session: Session
	) {
		this.defaultInputMode = new DefaultView();
		const entityCreateMode = new EntityCreateMode(
			viewer,
			this.engine,
			this.session
		);
		this.modes = {
			[ActivityTarget.System]: {},
			[ActivityTarget.Project]: {
				[ActivityAction.Explore]: this.defaultInputMode,
			},
			[ActivityTarget.Image]: {
				[ActivityAction.Create]: entityCreateMode,
			},
			[ActivityTarget.Marker]: {},
		};

		this.activeInputMode = this.getActive();
	}

	private getActive(): InputMode {
		if (
			this.target !== this.session.activity.target
			|| this.action !== this.session.activity.action
		) {
			this.target = this.session.activity.target;
			this.action = this.session.activity.action;

			this.activeInputMode = this.modes[this.target]?.[this.action]
				|| this.defaultInputMode;
		}
		return this.activeInputMode;
	}

	setElement(element: HTMLElement): void {
		element.addEventListener(
			"mousedown",
			(event) => this.getActive().onMouseDown(event),
			{capture: true}
		);
		element.addEventListener(
			"mousemove",
			(event) => this.getActive().onMouseMove(event),
			{capture: true}
		);
		element.addEventListener(
			"mouseup",
			(event) => this.getActive().onMouseUp(event),
			{capture: true}
		);
	}
}
