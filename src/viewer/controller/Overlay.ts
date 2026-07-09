import type {View} from "@src/viewer/controller";

export class Overlay {

	private el!: HTMLDivElement;

	constructor(private view: View) {}

	setElement(element: HTMLDivElement): void {
		this.el = element;

		const canvasFrame = document.createElement("div");
		canvasFrame.style.position = "absolute";
		canvasFrame.style.left = "0";
		canvasFrame.style.top = "0";
		canvasFrame.style.width = "1920px";
		canvasFrame.style.height = "1080px";
		canvasFrame.style.border = "1px solid red";
		this.el.appendChild(canvasFrame);
	}

	foo(): void {
		this.el.style.transform = `translate3d(${this.view.x}px, ${this.view.y}px, 0px)`;
	}
}