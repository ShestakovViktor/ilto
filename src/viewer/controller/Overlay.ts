import type {View} from "@src/viewer/controller";

export class Overlay {

	private el!: HTMLDivElement;

	private frame: HTMLDivElement;

	constructor(private view: View) {

		this.frame = document.createElement("div");
	}

	setElement(element: HTMLDivElement): void {
		this.el = element;

		this.frame.style.position = "absolute";
		this.frame.style.left = "0";
		this.frame.style.top = "0";
		this.frame.style.width = 1920 * this.view.s + "px";
		this.frame.style.height = 1080 * this.view.s + "px";
		this.frame.style.border = "1px solid red";
		this.el.appendChild(this.frame);
	}

	foo(): void {
		this.frame.style.transform = `translate3d(${this.view.x}px, ${this.view.y}px, 0px)`;
		this.frame.style.width = 1920 * this.view.s + "px";
		this.frame.style.height = 1080 * this.view.s + "px";
	}
}