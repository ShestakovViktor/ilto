import {LogManager, ActionManager} from "@feature/editor/controller";
import {MockAction} from "@feature/editor/controller/action";

describe("Action Manager", () => {
    let logManager: LogManager;
    let actionManager: ActionManager;
    let action: MockAction;
    let result: number;

    beforeEach(() => {
        logManager = new LogManager();
        actionManager = new ActionManager(logManager);
        action = new MockAction(
            () => result += 1,
            () => result -= 1,
            "MockAction",
            {}
        );
        result = 0;
    });

    it("should call undo when action queue is empty", () => {
        expect(() => actionManager.undo()).not.toThrow();
    });

    it("should call redo when action queue is empty", () => {
        expect(() => actionManager.redo()).not.toThrow();
    });

    it("should execute action", () => {
        actionManager.execute(action);

        expect(result).toBe(1);
    });

    it("should undo action", () => {
        actionManager.execute(action);
        actionManager.undo();

        expect(result).toBe(0);
    });

    it("should redo action", () => {
        actionManager.execute(action);
        actionManager.undo();
        actionManager.redo();

        expect(result).toBe(1);
    });

    it("should append action without executing it", () => {
        actionManager.append(action);

        expect(result).toBe(0);
    });

});