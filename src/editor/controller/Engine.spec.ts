import {Uid, Log, Engine} from "@src/editor/controller";
import {MockAction} from "@src/editor/action";

describe("Action Manager", () => {
    let uid: Uid;
    let log: Log;
    let engine: Engine;
    let action: MockAction;
    let result: number;

    beforeEach(() => {
        uid = new Uid();
        log = new Log(uid);
        engine = new Engine(log);
        action = new MockAction(
            () => result += 1,
            () => result -= 1,
            "MockAction",
            {}
        );
        result = 0;
    });

    it("should call undo when action queue is empty", () => {
        expect(() => engine.undo()).not.toThrow();
    });

    it("should call redo when action queue is empty", () => {
        expect(() => engine.redo()).not.toThrow();
    });

    it("should engineute action", () => {
        engine.exec(action);

        expect(result).toBe(1);
    });

    it("should undo action", () => {
        engine.exec(action);
        engine.undo();

        expect(result).toBe(0);
    });

    it("should redo action", () => {
        engine.exec(action);
        engine.undo();
        engine.redo();

        expect(result).toBe(1);
    });

    it("should append action without engineuting it", () => {
        engine.append(action);

        expect(result).toBe(0);
    });

});