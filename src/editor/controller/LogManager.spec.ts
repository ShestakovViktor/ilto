import {LogManager} from "@src/editor/controller";
import {LogLevel} from "../enum";

describe("Log Manager", () => {
    let logManager: LogManager;

    beforeEach(() => {
        logManager = new LogManager();
    });

    it("should log something", () => {
        logManager.log(LogLevel.Warning, "Warning");

        const logs = logManager.logs();
        expect(logs.length).toBe(1);
    });
});