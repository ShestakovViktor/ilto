import {LogManager} from "@src/editor/controller";
import {LOG_LEVEL} from "../enum";

describe("Log Manager", () => {
    let logManager: LogManager;

    beforeEach(() => {
        logManager = new LogManager();
    });

    it("should log something", () => {
        logManager.log(LOG_LEVEL.WARNING, "Warning");

        const logs = logManager.logs();
        expect(logs.length).toBe(1);
    });
});