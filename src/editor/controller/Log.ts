import {LogRecord} from "@src/editor/type";
import {LogLevel} from "@src/editor/enum";
import {Uid} from "@src/editor/controller";

export class Log {
    private buffer: LogRecord[] = [];

    constructor(private uid: Uid) {}

    log(
        level: LogLevel,
        message: string,
        params?: {[key: string]: unknown}
    ): void {
        const record: LogRecord = {
            id: this.uid.get(),
            timestamp: Date.now(),
            level,
            message,
            params,
        };

        this.buffer.push(record);
    }

    logs(): LogRecord[] {
        return this.buffer;
    }
}