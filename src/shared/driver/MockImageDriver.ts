/* eslint-disable @typescript-eslint/no-unused-vars */
import {ImageDriver, ImageTile} from "@src/shared/interface";

export class MockImageDriver implements ImageDriver {
    async initImage(
        width: number,
        height: number,
        blob: Blob
    ): Promise<ImageTile[]> {
        await new Promise(resolve => setTimeout(() => resolve, 100));
        return [];
    }
}