import {ImageDriver, ImageTile} from "@src/interface";

export class WebImageDriver implements ImageDriver {
    private tile = 512;

    async fooImage(
        file: File,
        width: number,
        height: number,
        mime: string
    ): Promise<string> {
        const image = document.createElement("img");
        if (width) image.width = width;
        if (height) image.height = height;
        image.src = URL.createObjectURL(file);
        await new Promise(resolve => image.onload = resolve);

        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error();

        context.drawImage(image, 0, 0, image.width, image.height);

        const base64 = canvas.toDataURL(mime);

        image.remove();
        canvas.remove();

        return base64;
    }

    splitInt(size: number): number {
        const rem = size % this.tile ? 0 : 1;
        return Math.floor(size / this.tile) + rem;
    }

    async initImage(
        blob: Blob,
        mime: string
    ): Promise<{
            width: number;
            height: number;
            tiles: ImageTile[];
        }> {
        const image = document.createElement("img");
        image.src = URL.createObjectURL(blob);
        await new Promise(resolve => image.onload = resolve);

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error();

        const tile = 512;
        const promises: Promise<ImageTile>[] = [];

        for (let y = 0; y < image.height; y += tile) {
            const heightRem = image.height - y;
            const tileHeight = heightRem < tile ? heightRem : tile;

            for (let x = 0; x < image.width; x += tile) {
                const widthRem = image.width - x;
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

        image.remove();

        const tiles = await Promise.all(promises);

        return {
            width: image.width,
            height: image.height,
            tiles,
        };
    }
}