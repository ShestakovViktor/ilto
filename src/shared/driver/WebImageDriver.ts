import {ImageDriver, ImageTile} from "@src/shared/interface";

export class WebImageDriver implements ImageDriver {
    private tile = 512;

    private async prepareImage(
        blob: Blob,
        width: number,
        height: number
    ): Promise<HTMLCanvasElement> {
        const image = document.createElement("img");
        image.src = URL.createObjectURL(blob);
        await new Promise(resolve => image.onload = resolve);

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error();

        canvas.width = width;
        canvas.height = height;

        context.drawImage(image, 0, 0, width, height);

        return canvas;
    }

    async initImage(
        width: number,
        height: number,
        blob: Blob,
        mime: string
    ): Promise<ImageTile[]> {
        const image = await this.prepareImage(blob, width, height);

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error();

        const tile = 512;
        const promises: Promise<ImageTile>[] = [];

        for (let y = 0; y < height; y += tile) {
            const heightRem = height - y;
            const tileHeight = heightRem < tile ? heightRem : tile;

            for (let x = 0; x < width; x += tile) {
                const widthRem = width - x;
                const tileWidth = widthRem < tile ? widthRem : tile;

                canvas.width = tileWidth;
                canvas.height = tileHeight;

                context.drawImage(image,
                    x, y, tileWidth, tileHeight,
                    0, 0, tileWidth, tileHeight
                );

                promises.push(
                    new Promise<ImageTile>((resolve) => {
                        canvas.toBlob((blob) => {
                            if (!blob) return;

                            resolve({
                                x,
                                y,
                                width: tileWidth,
                                height: tileHeight,
                                media: mime,
                                size: blob.size,
                                path: URL.createObjectURL(blob),
                            });
                        }, mime);
                    })
                );
            }
        }

        const tiles = await Promise.all(promises);

        image.remove();
        canvas.remove();

        return tiles;
    }
}