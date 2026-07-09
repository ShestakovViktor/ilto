import type {ImageLayout, ImageTile, TileConfig} from "@src/viewer/type";

export class Shear {

	constructor(private readonly tileConfig: TileConfig) {}

	private getLayout(bitmap: ImageBitmap): ImageLayout {
		const columns = Math.ceil(bitmap.width / this.tileConfig.src);
		const rows = Math.ceil(bitmap.height / this.tileConfig.src);
		return {columns, rows, count: columns * rows};
	}

	async cut(
		file: Blob | File
	): Promise<{
		layout: ImageLayout;
		tiles: ImageTile[];
	}> {
		const bitmap = await createImageBitmap(file);

		const layout = this.getLayout(bitmap);
		const canvas = this.getCanvas(bitmap, layout);

		bitmap.close();

		const tiles: ImageTile[] = [];

		const tileCanvas = new OffscreenCanvas(
			this.tileConfig.dst,
			this.tileConfig.dst
		);

		const tileCanvasCtx = tileCanvas.getContext("2d");
		if (!tileCanvasCtx) throw new Error();
		tileCanvasCtx.imageSmoothingEnabled = false;

		for (let row = 0; row < layout.rows; row++) {
			for (let col = 0; col < layout.columns; col++) {
				const srcX = col * this.tileConfig.src;
				const srcY = row * this.tileConfig.src;

				tileCanvasCtx.clearRect(
					0,
					0,
					this.tileConfig.dst,
					this.tileConfig.dst
				);

				tileCanvasCtx.drawImage(
					canvas,
					srcX,
					srcY,
					this.tileConfig.ext,
					this.tileConfig.ext,
					this.tileConfig.spacing,
					this.tileConfig.spacing,
					this.tileConfig.ext,
					this.tileConfig.ext
				);

				const bitmap = await createImageBitmap(tileCanvas);

				tiles.push({col, row, bitmap});
			}
		}

		return {layout, tiles};
	}

	getCanvas(bitmap: ImageBitmap, layout: ImageLayout): OffscreenCanvas {
		const e = this.tileConfig.extrusion;

		const width = layout.columns * this.tileConfig.src;
		const height = layout.rows * this.tileConfig.src;

		const canvas = new OffscreenCanvas(width + e * 2, height + e * 2);
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error();

		ctx.imageSmoothingEnabled = false;

		ctx.drawImage(bitmap, e, e);

		const edges = [
			{
				src: {x: e, y: e, w: 1, h: height},
				dst: {x: 0, y: e, w: e, h: height},
			},
			{
				src: {x: e + width - 1, y: e, w: 1, h: height},
				dst: {x: e + width, y: e, w: e, h: height},
			},
			{
				src: {x: 0, y: e, w: e + width + e, h: 1},
				dst: {x: 0, y: 0, w: e + width + e, h: e},
			},
			{
				src: {x: 0, y: e + height - 1, w: e + width + e, h: 1},
				dst: {x: 0, y: e + height, w: e + width + e, h: e},
			},
		];

		for (const edge of edges) {
			ctx.drawImage(canvas,
				edge.src.x, edge.src.y, edge.src.w, edge.src.h,
				edge.dst.x, edge.dst.y, edge.dst.w, edge.dst.h
			);
		}

		return canvas;
	}
}
