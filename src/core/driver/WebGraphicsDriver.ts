import type {GraphicsDriver} from "@src/core/interface";
import {MimeType} from "@src/core/enum";

export class WebGraphicsDriver implements GraphicsDriver {

	async prepareSvg(file: File): Promise<File> {
		const svgText = await file.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgText, MimeType.Svg);
		const svgElement = doc.querySelector("svg");

		if (!svgElement) throw new Error();

		svgElement.setAttribute("id", "root");

		const result = new XMLSerializer().serializeToString(doc);

		const blob = new File([result], file.name, {type: MimeType.Svg});

		return blob;
	}

	async prepareImg(
		file: File,
		width: number,
		height: number,
		size: number
	): Promise<{
		x: number;
		y: number;
		width: number;
		height: number;
		file: File;
	}[]> {
		const bitmap = await createImageBitmap(file);

		const sourceCanvas = document.createElement("canvas");
		sourceCanvas.width = width;
		sourceCanvas.height = height;
		sourceCanvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
		bitmap.close();

		const layout = this.getTileCoordinates(width, height, size);

		const tiles = await Promise.all(
			layout.map((rect, index) => {
				const canvas = document.createElement("canvas");
				canvas.width = rect.width;
				canvas.height = rect.height;

				// Вычисляем левый верхний угол для исходного Canvas,
				// так как drawImage принимает координаты верхнего левого угла (source x, source y)
				const srcX = rect.x - rect.width / 2;
				const srcY = rect.y - rect.height / 2;

				canvas.getContext("2d")!.drawImage(
					sourceCanvas,
					srcX, srcY, rect.width, rect.height, // Откуда берем (из исходного)
					0, 0, rect.width, rect.height // Куда рисуем (в новый тайл)
				);

				return new Promise<{
					x: number;
					y: number;
					width: number;
					height: number;
					file: File;
				}>(resolve => {
					canvas.toBlob(blob => {
						if (!blob) throw new Error();
						const tile = new File(
							[blob],
							file.name + index,
							{type: file.type}
						);
						resolve({...rect, file: tile});
					}, file.type);
				});
			})
		);

		sourceCanvas.remove();

		return tiles;
	}

	private getTileCoordinates(
		width: number,
		height: number,
		size: number
	): {x: number; y: number; width: number; height: number}[] {
		const layout = [];
		for (let y = 0; y < height; y += size) {
			for (let x = 0; x < width; x += size) {
				const w = Math.min(size, width - x);
				const h = Math.min(size, height - y);

				// Вычисляем центр текущего тайла относительно исходного изображения
				const centerX = x + w / 2;
				const centerY = y + h / 2;

				layout.push({
					x: centerX, // Теперь это центр по X
					y: centerY, // Теперь это центр по Y
					width: w,
					height: h,
				});
			}
		}
		return layout;
	}
}
