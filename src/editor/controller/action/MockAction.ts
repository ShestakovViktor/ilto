import {Action} from "../Action";

export class MockAction extends Action<void> {
    constructor(
        private onSubmit: () => void,
        private onRevert: () => void,
        private logMessage: string,
        private logData: {[key: string]: unknown}
    ) {
        super();
    }

    submit(): void {
        this.onSubmit();
    }

    revert(): void {
        this.onRevert();
    }

    getLogMessage(): string {
        return this.logMessage;
    }

    getLogData(): {[key: string]: unknown} {
        return this.logData;
    }
}