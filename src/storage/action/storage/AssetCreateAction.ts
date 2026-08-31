import {AssetKind} from "@src/storage/enum";
import type {Asset, Graphics} from "@src/storage/type/asset";
import {Action} from "@src/shared/controller";
import type {Storage} from "@src/storage/Storage";

export class AssetCreateAction extends Action<Asset> {
	name = "AssetCreateAction";

	private assetId?: number;

	constructor(
		private storage: Storage,
		public params: {
			size: number;
			mime: string;
			path: string;
			name: string;
			meta: {footnote: string};
		}
	) {
		super();
	}

	getLogMessage(): string {
		return "create image";
	}

	getLogData(): Record<string, unknown> {
		return {
			assetId: this.assetId,
			props: this.params,
		};
	}

	exec(): Graphics {
		const image = this.storage.repo.asset.create<Graphics>({
			kind: AssetKind.Graphics,
			...this.params,
		});

		this.assetId = image.id;

		return image;
	}

	undo(): void {
		if (this.assetId) {
			this.storage.repo.asset.delete(this.assetId);
		}
	}
}