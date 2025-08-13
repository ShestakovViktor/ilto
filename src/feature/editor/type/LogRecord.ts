import {LOG_LEVEL} from "@feature/editor/enum";

export type LogRecord = {
    id: string;
    level: typeof LOG_LEVEL[keyof typeof LOG_LEVEL];
    timestamp: number;
    message: string;
    params?: {[key: string]: unknown};
};