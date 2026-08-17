import type {Mode} from "@src/editor/controller";
import {InputKind} from "@src/editor/enum";
import {
	DefaultView,
	EntityCreateMode,
} from "@src/editor/controller/mode";
import type {Session} from "@src/editor/type";
import type {View} from "@src/viewer/controller";

export class MouseController {
	private modes: Record<string, Mode>;
	private active: Mode;
	private currentInputKind: InputKind; // Запоминаем текущий enum

	constructor(
		private view: View,
		private session: Session
	) {
		const defaultView = new DefaultView();
		const entityCreate = new EntityCreateMode(
			this.view,
			this.session
		);
		this.modes = {
			[InputKind.DefaultView]: defaultView,
			[InputKind.ImageCreate]: entityCreate,
		};
		this.currentInputKind = InputKind.DefaultView;
		this.active = this.modes[this.currentInputKind];
	}

	private getActive(): Mode {
		if (this.currentInputKind !== this.session.input) {
			this.currentInputKind = this.session.input;
			this.active = this.modes[this.session.input];
		}
		return this.active;
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
