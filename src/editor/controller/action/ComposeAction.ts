import {Action} from "@src/editor/controller";

export class ComposeAction extends Action {
    constructor(private actions: Action[]) {
        super();
    }

    execute(): unknown[] {
        return this.actions.map((action) => action.submit());
    }

    submit(): void {
        this.actions.map((action) => action.submit());
    }

    revert(): void {
        this.actions.toReversed().map((action) => action.revert());
    }

    getLogData(): {[key: string]: unknown} {
        return this.actions.reduce(
            (accum, action) => {
                accum[action.getLogMessage()] = action.getLogData();
                return accum;
            },
            {} as {[key: string]: unknown}
        );

    }

    getLogMessage(): string {
        return "Compose action";
    }
}