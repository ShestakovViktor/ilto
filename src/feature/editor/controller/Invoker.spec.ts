import assert from "assert";
import {ActionManager} from "./ActionManager";
import {MockAction} from "@feature/editor/controller/action";

describe("Invoker", () => {
    it("Execute", () => {
        const store: string[] = [];
        const action = new MockAction(store);
        const invoker = new ActionManager();
        invoker.execute(action);

        assert.equal(store.length, 1);
    });

    it("Undo", () => {
        const store: string[] = [];
        const action = new MockAction(store);
        const invoker = new ActionManager();
        invoker.execute(action);

        invoker.undo();

        assert.equal(store.length, 0);
    });

    it("Redo", () => {
        const store: string[] = [];
        const action = new MockAction(store);
        const invoker = new ActionManager();
        invoker.execute(action);

        invoker.undo();

        invoker.redo();

        assert.equal(store.length, 1);
    });
});