import type {Hotkey} from "@src/editor/controller";

export class Key {
	constructor(private hotkey: Hotkey[]){}

	setElement(editor: HTMLElement): void {
		editor.addEventListener("keydown", (event: KeyboardEvent) => {
			const active = document.activeElement;

			if (active?.tagName.toLowerCase() == "input") return;
			if (active != editor && !editor.contains(active)) return;

			const action = this.hotkey.find(hotkey => hotkey.check(event));

			if (action) {
				void action.handle();
				event.preventDefault();
				event.stopPropagation();
			}
		});
	}
}