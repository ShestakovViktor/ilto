import {Media} from "@feature/editor/controller";

describe("Media", () => {
    let media: Media;

    beforeEach(() => {
        media = new Media();
    });

    it("should convert media type to file extension", () => {
        expect(media.typeToExtension("image/svg+xml")).toBe("svg");
    });

    it("should convert file extension to media type", () => {
        expect(media.extensionToType("svg")).toBe("image/svg+xml");
    });
});