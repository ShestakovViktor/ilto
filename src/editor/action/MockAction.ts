import {Action} from "@src/editor/action";

export class MockAction extends Action<void> {
    constructor(
        private onSubmit: () => void,
        private onRevert: () => void,
        private logMessage: string,
        private logData: {[key: string]: unknown}
    ) {
        super();
    }

    async exec(): Promise<void> {
        this.onSubmit();
    }

    async undo(): Promise<void> {
        this.onRevert();
    }

    getLogMessage(): string {
        return this.logMessage;
    }

    getLogData(): {[key: string]: unknown} {
        return this.logData;
    }
}