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
	private activeMode: Mode;
	private inputKind: InputKind;

	constructor(
		private view: View,
		private session: Session
	) {
		const defaultViewMode = new DefaultView();
		const entityCreateMode = new EntityCreateMode(
			this.view,
			this.session
		);
		this.modes = {
			[InputKind.DefaultView]: defaultViewMode,
			[InputKind.ImageCreate]: entityCreateMode,
		};
		this.inputKind = InputKind.DefaultView;
		this.activeMode = this.modes[this.inputKind];
	}

	private getActive(): Mode {
		if (this.inputKind !== this.session.inputKind) {
			this.inputKind = this.session.inputKind;
			this.activeMode = this.modes[this.session.inputKind];
		}
		return this.activeMode;
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
