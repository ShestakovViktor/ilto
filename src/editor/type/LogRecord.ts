import {LogLevel} from "@src/editor/enum";

export type LogRecord = {
    id: string;
    level: typeof LogLevel[keyof typeof LogLevel];
    timestamp: number;
    message: string;
    params?: {[key: string]: unknown};
};