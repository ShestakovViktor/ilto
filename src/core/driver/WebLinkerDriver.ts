import type {Schema, Asset} from "@src/core/type";
import {Mime} from "@src/editor/controller";
import type {LinkerDriver} from "@src/core/interface";

export class WebLinkerDriver implements LinkerDriver {
	private mimeMapper = new Mime();

	async loadBlobs(files: Record<string, Blob>): Promise<Schema> {
		const dataString = await files["data.json"].text();
		const data = JSON.parse(dataString) as Schema;

		for (const id in data.asset) {
			const asset = data.asset[id];
			if (!asset.path) throw new Error("");
			asset.path = URL.createObjectURL(files[asset.path]);
		}

		return data;
	}

	async unloadBlobs(data: Schema): Promise<Record<string, Blob>> {
		return {
			...await this.getAssetsBlobs(data.asset),
			...this.getDataBlob(data),
		};
	}

	private async getAssetBlob (asset: Asset): Promise<[string, Blob]> {
		const response = await fetch(asset.path);
		const blob = await response.blob();
		const ext = this.mimeMapper.toExt(asset.mime);
		const path = `asset/${asset.id}.${ext}`;

		asset.path = path;

		return [path, blob];
	}

	private async getAssetsBlobs(
		assets: Record<number, Asset>
	): Promise<Record<string, Blob>> {
		const promises: Promise<[string, Blob]>[] = [];

		for (const id in assets) {
			promises.push(this.getAssetBlob(assets[id]));
		}

		const blobs = Object.fromEntries(await Promise.all(promises));

		return blobs;
	}

	private getDataBlob(data: Schema): Record<string, Blob> {
		const dataString = JSON.stringify(data, null, 4);
		const dataType = "application/json;charset=utf-8";
		const dataBlob = new Blob([dataString], {type: dataType});
		return {["data.json"]: dataBlob};
	}
}