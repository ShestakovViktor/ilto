import {DEBUG_LEVEL} from "@feature/editor/enum";

export type LogRecord = {
    id: string;
    level: typeof DEBUG_LEVEL[keyof typeof DEBUG_LEVEL];
    timestamp: number;
    message: string;
    params?: {[key: string]: any};
};