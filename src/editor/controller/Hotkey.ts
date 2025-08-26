export class Hotkey {
    protected code = "";

    protected ctrlKey = false;

    protected shiftKey = false;

    check(event: {
        code: string;
        ctrlKey: boolean;
        shiftKey: boolean;
    }): boolean {
        return event.code == this.code
            && event.ctrlKey == this.ctrlKey
            && event.shiftKey == this.shiftKey;
    }

    handle(): void | Promise<void> {
        throw new Error("Implement me!");
    }
}