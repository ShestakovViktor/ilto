export const LOG_LEVEL = {
    DEBUG: "debug",
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
    CRITICAL: "critical",
} as const;

export type LogLevel = typeof LOG_LEVEL[keyof typeof LOG_LEVEL];