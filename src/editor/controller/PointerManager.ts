import type {InputMode} from "./input-mode/InputMode";
import type {InputResolveMode} from "./input-mode/InputResolveMode";
import {DefaultView} from "./input-mode/DefaultView";

export class PointerManager {
	private activeInputMode: InputMode;
	private defaultInputMode: DefaultView;

	constructor() {
		this.defaultInputMode = new DefaultView();
		this.activeInputMode = this.defaultInputMode;
	}

	setMode(mode: InputMode): void {
		this.activeInputMode = mode;
	}

	resolve<T>(mode: InputResolveMode<T>): void {
		this.activeInputMode = mode;

		mode.onRelease(() => {
			this.resetToDefault();
		});
	}

	resetToDefault(): void {
		this.activeInputMode = this.defaultInputMode;
	}

	setElement(element: HTMLElement): void {
		element.addEventListener(
			"pointerdown",
			(event) => this.activeInputMode.onMouseDown(event),
			{capture: true}
		);
		element.addEventListener(
			"pointermove",
			(event) => this.activeInputMode.onMouseMove(event),
			{capture: true}
		);
		element.addEventListener(
			"pointerup",
			(event) => this.activeInputMode.onMouseUp(event),
			{capture: true}
		);
	}
}