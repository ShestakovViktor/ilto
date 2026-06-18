export abstract class Mode {
	abstract onMouseDown(event: MouseEvent): void;

	abstract onMouseMove(event: MouseEvent): void;

	abstract onMouseUp(event: MouseEvent): void;
}
