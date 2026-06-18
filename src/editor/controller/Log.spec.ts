import {Uid, Log} from "@src/editor/controller";
import {LogKind} from "../enum";

describe("Log Manager", () => {
	let logManager: Log;
	let uid: Uid;

	beforeEach(() => {
		uid = new Uid();
		logManager = new Log(uid);
	});

	it("should log something", () => {
		logManager.log(LogKind.Warning, "Warning");

		const logs = logManager.logs();
		expect(logs.length).toBe(1);
	});
});