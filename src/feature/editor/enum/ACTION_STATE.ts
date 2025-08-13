export const ACTION_STATE = {
    AWAITING: "awaiting",
    EXECUTED: "executed",
    REVERTED: "reverted",
} as const;

export type ActionState = typeof ACTION_STATE[keyof typeof ACTION_STATE];