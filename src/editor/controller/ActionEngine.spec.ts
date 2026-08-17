import {UidGenerator, ActionLog} from "@src/editor/controller";
import {ActionEngine} from "@src/editor/controller/";
import {MockAction} from "@src/editor/action";

describe("Action Manager", () => {
	let uid: UidGenerator;
	let log: ActionLog;
	let engine: ActionEngine;
	let action: MockAction;
	let result: number;

	beforeEach(() => {
		uid = new UidGenerator();
		log = new ActionLog(uid);
		engine = new ActionEngine(log);
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

	it("should engineute action", async() => {
		await engine.exec(action);

		expect(result).toBe(1);
	});

	it("should undo action", async() => {
		await engine.exec(action);
		await engine.undo();

		expect(result).toBe(0);
	});

	it("should redo action", async() => {
		await engine.exec(action);
		await engine.undo();
		await engine.redo();

		expect(result).toBe(1);
	});

	it("should append action without engineuting it", () => {
		engine.append(action);

		expect(result).toBe(0);
	});

});