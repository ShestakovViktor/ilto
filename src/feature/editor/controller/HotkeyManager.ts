import {Hotkey} from "@feature/editor/controller";
import {
    RedoHotkey,
    UndoHotkey,
    SaveHotkey,
} from "@feature/editor/controller/hotkey";

export class HotkeyManager {

    private hotkey: Hotkey[] = [
        new RedoHotkey(),
        new UndoHotkey(),
        new SaveHotkey(),
    ];

    constructor(editor: HTMLElement) {

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