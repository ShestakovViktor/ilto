import {EditorContext, LogRecord} from "@feature/editor/type";
import {useEditorContext} from "../context";
import {uuid} from "@shared/uuid";
import {DEBUG_LEVEL} from "@feature/editor/enum";

export class LogManager {
    private duration = 3000;

    private editorContext: EditorContext;

    constructor() {
        this.editorContext = useEditorContext();
    }

    log(
        level: typeof DEBUG_LEVEL[keyof typeof DEBUG_LEVEL],
        message: string,
        params?: {[key: string]: unknown}
    ): void {
        const log: LogRecord = {
            id: uuid(),
            timestamp: Date.now(),
            level,
            message,
            params,
        };

        console.log(log);
    }
}