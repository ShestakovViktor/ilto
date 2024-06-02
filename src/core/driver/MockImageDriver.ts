/* eslint-disable @typescript-eslint/no-unused-vars */
import {ImageDriver, ImageTile} from "@src/interface";

export class MockImageDriver implements ImageDriver {

    async initImage(blob: Blob): Promise<{
        width: number;
        height: number;
        tiles: ImageTile[];
    }> {
        await new Promise(resolve => setTimeout(() => resolve, 100));
        return {
            width: 1024,
            height: 1024,
            tiles: [],
        };
    }

    fooImage(file: File, width: number, height: number): Promise<string> {
        return new Promise(() => "qwe");
    }
}