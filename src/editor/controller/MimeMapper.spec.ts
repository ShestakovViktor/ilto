import {MimeMapper} from "@src/editor/controller";

describe("Media", () => {
    let mimeMapper: MimeMapper;

    beforeEach(() => {
        mimeMapper = new MimeMapper();
    });

    it("should convert media type to file extension", () => {
        expect(mimeMapper.toExt("image/svg+xml")).toBe("svg");
    });

    it("should convert file extension to media type", () => {
        expect(mimeMapper.fromExt("svg")).toBe("image/svg+xml");
    });
});