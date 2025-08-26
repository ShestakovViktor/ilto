import {ComposeAction} from "@src/editor/controller/action";
import {MockAction} from "@src/editor/controller/action";

describe("Compose Action", () => {
    let composeAction: ComposeAction;
    let result: number;

    beforeEach(() => {
        composeAction = new ComposeAction([
            new MockAction(
                () => result += 1,
                () => result -= 1,
                "First action",
                {data: 1}
            ),
            new MockAction(
                () => result += 2,
                () => result -= 2,
                "Second action",
                {data: 2}
            ),
        ]);
        result = 0;
    });

    it("should submit compose action", () => {
        composeAction.submit();

        expect(result).toBe(3);
    });

    it("should revert compose action", () => {
        composeAction.revert();

        expect(result).toBe(-3);
    });

    it("should check summarized log data", () => {
        const data = composeAction.getLogData();
        expect(data).toStrictEqual({
            "First action": {data: 1},
            "Second action": {data: 2},
        });
    });
});