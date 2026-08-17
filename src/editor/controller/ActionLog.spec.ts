import {UidGenerator, ActionLog} from "@src/editor/controller";
import {LogKind} from "../enum";

describe("Log Manager", () => {
	let logManager: ActionLog;
	let uid: UidGenerator;

	beforeEach(() => {
		uid = new UidGenerator();
		logManager = new ActionLog(uid);
	});

	it("should log something", () => {
		logManager.log(LogKind.Warning, "Warning");

		const logs = logManager.logs();
		expect(logs.length).toBe(1);
	});
});