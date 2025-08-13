import {LogRecord} from "@feature/editor/type";
import {uuid} from "@shared/uuid";
import {LogLevel} from "@feature/editor/enum";

export class LogManager {
    private buffer: LogRecord[] = [];

    log(
        level: LogLevel,
        message: string,
        params?: {[key: string]: unknown}
    ): void {
        const record: LogRecord = {
            id: uuid(),
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