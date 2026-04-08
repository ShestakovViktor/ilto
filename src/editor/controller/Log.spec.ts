import {Uid, Log} from "@src/editor/controller";
import {LogLevel} from "../enum";

describe("Log Manager", () => {
    let logManager: Log;
    let uid: Uid;

    beforeEach(() => {
        uid = new Uid();
        logManager = new Log(uid);
    });

    it("should log something", () => {
        logManager.log(LogLevel.Warning, "Warning");

        const logs = logManager.logs();
        expect(logs.length).toBe(1);
    });
});