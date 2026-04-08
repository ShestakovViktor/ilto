/* eslint-disable @typescript-eslint/no-unused-vars */
import {ImageDriver} from "@src/core/interface";

export class MockImageDriver implements ImageDriver {
    async prepareSvg(file: File): Promise<File> {
        await new Promise(resolve => setTimeout(() => resolve, 100));
        return new File([], "test");
    }

    async prepareImg(
        file: File,
        width: number,
        height: number,
        size: number
    ): Promise<{x: number; y: number; w: number; h: number; f: File}[]> {
        await new Promise(resolve => setTimeout(() => resolve, 100));
        return [];
    }
}