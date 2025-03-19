import {useEditorContext} from "@feature/editor/context";
import {EditorContext} from "@feature/editor/type";
import {useStoreContext} from "@feature/store/context";
import {StoreContext} from "@feature/store/type";

export class Hotkey {
    protected code = "";

    protected ctrlKey = false;

    protected shiftKey = false;

    protected storeContext: StoreContext;

    protected editorContext: EditorContext;

    constructor() {
        this.storeContext = useStoreContext();
        this.editorContext = useEditorContext();
    }

    check(event: {
        code: string;
        ctrlKey: boolean;
        shiftKey: boolean;
    }): boolean {
        return event.code == this.code
            && event.ctrlKey == this.ctrlKey
            && event.shiftKey == this.shiftKey;
    }

    handle(): void | Promise<void> {
        throw new Error("Implement me!");
    }
}