import {Action} from "@feature/editor/controller";
import {useEditorContext} from "../context";
import {EditorContext} from "../type";
import {DEBUG_LEVEL} from "../enum";

export class ActionManager {

    private executed: Action<any>[] = [];

    private canceled: Action<any>[] = [];

    private editorContext: EditorContext;

    constructor() {
        this.editorContext = useEditorContext();
    }

    execute<T>(action: Action<T>): T {
        const result = action.execute();
        this.executed.push(action);
        this.canceled.length = 0;

        this.editorContext.log.log(
            DEBUG_LEVEL.INF,
            action.getLogMessage(),
            action.getLogData()
        );

        return result;
    }

    append<T>(action: Action<T>): void {
        this.executed.push(action);
        this.canceled.length = 0;

        this.editorContext.log.log(
            DEBUG_LEVEL.INF,
            action.getLogMessage(),
            action.getLogData()
        );
    }

    undo(): void {
        const action = this.executed.pop();
        if (!action) return;

        action.revert();
        this.canceled.push(action);
    }

    redo(): void {
        const action = this.canceled.pop();

        if (!action) return;

        action.execute();
        this.executed.push(action);
    }
}