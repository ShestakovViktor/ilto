import {EntityKind} from "@src/core/enum";
import {Image, Layer} from "@src/core/type";
import {Storage} from "@src/storage/controller";

export class Canvas {
    private canvas!: HTMLCanvasElement;

    private ctx!: CanvasRenderingContext2D;

    private pending: Map<number, Promise<void>> = new Map();

    private bitmap: Map<number, ImageBitmap> = new Map();

    constructor(private storage: Storage) {
    }

    setContext(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error();
        this.ctx = ctx;
    }

    foo(id: number) {
        const entity = this.storage.data.entity.select(id);
        if (!entity) return;

        if (entity.kind === EntityKind.Layer) {
            const layer = entity as Layer;

            layer.childIds.map((id: number) => {
                this.foo(id);
            });
        }
        else if (entity.kind == EntityKind.Image) {
            const image = entity as Image;
            const asset = this.storage.data.asset.select(image.assetId);
            if (!asset) throw new Error();

            if (this.bitmap.has(asset.id)) {
                const bitmap = this.bitmap.get(asset.id);
                if (!bitmap) return;
                this.ctx.drawImage(
                    bitmap,
                    image.x,
                    image.y,
                    image.w,
                    image.h
                );
            }
            else if (this.pending.has(asset.id)) {
                this.ctx.beginPath();

                this.ctx.rect(image.x, image.y, image.w, image.h);

                this.ctx.stroke();
            }
            else {
                this.pending.set(asset.id, (async () => {
                    try {
                        await this.loadBitmap(asset.id, asset.path);
                    }
                    finally {
                        this.pending.delete(asset.id);
                    }
                })());
            }
        }
    }

    async loadBitmap(id: number, path: string) {
        const response = await fetch(path);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);

        this.pending.delete(id);
        this.bitmap.set(id, bitmap);

        this.draw();
    }

    async draw(x = 0, y = 0, s = 1) {
        this.ctx.save();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(x, y);

        this.ctx.scale(s, s);

        this.ctx.beginPath();

        this.ctx.rect(0, 0, 1920, 1080);

        this.ctx.stroke();

        this.foo(1);

        this.ctx.restore();
    }
}