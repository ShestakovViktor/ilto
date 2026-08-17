import type {DataStorage} from "@src/core/controller";
import type {Shear, TextureAtlas} from "@src/viewer/controller";
import type {SceneNode, TextureLayout} from "@src/viewer/type";

export class TextureManager{
	constructor(
		private textureAtlas: TextureAtlas,
		private storage: DataStorage,
		private shear: Shear
	) {}

	async formData(nodes: SceneNode[]): Promise<TextureLayout[]> {
		const layouts: TextureLayout[] = [];
		for (const node of nodes) {
			if (!node.assetId) continue;
			if (this.textureAtlas.checkTextureLayout(node.assetId)) {
				const textureLayout = this.textureAtlas
					.getTextureLayout(node.assetId);

				layouts.push(textureLayout);
			}
			else {
				const path = this.getAssetPath(node.assetId);
				const blob = await this.loadAsset(path);
				const {layout, tiles} = await this.shear.cut(blob);

				const textureLayout = this.textureAtlas.uploadImage(
					node.assetId,
					layout,
					tiles
				);
				layouts.push(textureLayout);
			}
		}

		return layouts;
	}

	getAssetPath(assetId: number): string {
		const asset = this.storage.asset.select(assetId);
		if (!asset) throw new Error();
		return asset.path;
	}

	async loadAsset(path: string): Promise<Blob> {
		const response = await fetch(path);
		const blob = await response.blob();
		return blob;
	}
}